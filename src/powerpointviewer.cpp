#include "powerpointviewer.h"

#include <QApplication>
#include <QDateTime>
#include <QProcess>
#include <QPushButton>
#include <QVBoxLayout>

#include "app.h"
#include "biglabel.h"
#include "pixmaplabel.h"
#include "settings.h"

ITEMVIEWER_REGISTER(PowerPointViewer, QStringList({
     "application/vnd.ms-powerpoint",
     "application/vnd.openxmlformats-officedocument.presentationml.presentation"
}))

PowerPointViewer::PowerPointViewer(const QUrl& itemUrl, QWidget* parent)
    : ItemViewer(itemUrl, parent),
      m_currentSlide(-1),
      m_hasError(false),
      m_pagingLbl(NULL),
      m_slideDisplay(NULL)
{
    if (!loadSlidesFromCache()) {
        qApp->setOverrideCursor(Qt::WaitCursor);
        if (makeSlidesFromPpt())
            m_hasError = !loadSlidesFromCache();
        else
            m_hasError = true;
        qApp->setOverrideCursor(Qt::ArrowCursor);
    }
    setupUi();
}

QByteArray PowerPointViewer::saveState() const
{
    QByteArray state;
    QDataStream out(&state, QIODevice::WriteOnly);

    out << (quint16) 1; // version
    out << (qint32) m_currentSlide;
    return state;
}

void PowerPointViewer::restoreState(const QByteArray &state)
{
    QDataStream in(state);
    quint16 version;

    in >> version;
    if (version == 1) {
        qint32 currentSlide;

        in >> currentSlide;
        setCurrentSlide(currentSlide);
    }
}

int PowerPointViewer::currentSlide() const
{
    return m_currentSlide;
}

void PowerPointViewer::setCurrentSlide(int index)
{
    if (index >= 0 && index < m_slides.length()) {
        m_currentSlide = index;
        m_slideDisplay->setPixmap(QPixmap(m_slides[index]));
        m_pagingLbl->setText(QString("%1/%2").arg(index + 1).arg(m_slides.length()));
    }
    if (buddy() != NULL) {
        buddy<PowerPointViewer*>()->setCurrentSlide(index);
    }
}

void PowerPointViewer::setupUi()
{
    if (m_hasError) {
        contentLayout()->addWidget(new BigLabel(tr("Erreur: Impossible d'afficher le PowerPoint."), this));
    } else {
        m_slideDisplay = new PixmapLabel(this);

        m_pagingLbl = new QLabel(this);

        QPushButton* backBtn = new QPushButton(this);
        backBtn->setFlat(true);
        backBtn->setFont(QFont("FontAwesome", 13));
        backBtn->setText("\uF060");
        connect(backBtn, &QPushButton::clicked, [=]() {
            setCurrentSlide(currentSlide() - 1);
        });

        QPushButton* forwBtn = new QPushButton(this);
        forwBtn->setFlat(true);
        forwBtn->setFont(QFont("FontAwesome", 13));
        forwBtn->setText("\uF061");
        connect(forwBtn, &QPushButton::clicked, [=]() {
            setCurrentSlide(currentSlide() + 1);
        });

        contentLayout()->addWidget(m_slideDisplay, 1);

        controlsLayout()->addStretch(1);
        controlsLayout()->addWidget(backBtn);
        controlsLayout()->addWidget(m_pagingLbl);
        controlsLayout()->addWidget(forwBtn);
        controlsLayout()->addStretch(1);

        setCurrentSlide(0);
    }
}

bool PowerPointViewer::loadSlidesFromCache()
{
    QFileInfo pptInfo = itemUrl().toLocalFile();

    m_slides.clear();
    foreach (QFileInfo entry, cacheDir().entryInfoList({"*.jpg"}, QDir::Files, QDir::Name)) {
        if (entry.lastModified() < pptInfo.lastModified())
            return false;
        m_slides.append(entry.absoluteFilePath());
    }
    return (m_slides.length() > 0);
}

bool PowerPointViewer::makeSlidesFromPpt()
{
    QFileInfo pptFile = itemUrl().toLocalFile();
    QFileInfo pdfFile = cacheDir().absoluteFilePath(pptFile.baseName() + ".pdf");
    int       ec;

    ec = QProcess::execute(gApp->settings()->value<QString>(Settings::LibreOfficePath), {
        "--headless", "--convert-to", "pdf", "--outdir", cacheDir().absolutePath(), pptFile.absoluteFilePath()
    });
    if (ec == QProcess::NormalExit) {
        ec = QProcess::execute(gApp->settings()->value<QString>(Settings::ImageMagickPath), {
            pdfFile.absoluteFilePath(), cacheDir().absoluteFilePath("%07d.jpg")
        });
        if (ec == QProcess::NormalExit) {
            return true;
        }
    }
    return false;
}
