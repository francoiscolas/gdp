#include "powerpointviewer.h"

#include <QAxObject>
#include <QDateTime>
#include <QToolButton>
#include <QVBoxLayout>

#include "biglabel.h"
#include "pixmaplabel.h"

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
        if (!loadSlidesFromPresentation())
            m_hasError = true;
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
        contentLayout()->addWidget(new BigLabel(tr("Erreur: Impossible d'instancier l'ActiveX de PowerPoint."), this));
    } else {
        m_slideDisplay = new PixmapLabel(this);

        m_pagingLbl = new QLabel(this);

        QToolButton* backBtn = new QToolButton(this);
        backBtn->setFont(QFont("FontAwesome"));
        backBtn->setText("\uF060");
        connect(backBtn, &QToolButton::clicked, [=]() {
            setCurrentSlide(currentSlide() - 1);
        });

        QToolButton* forwBtn = new QToolButton(this);
        forwBtn->setFont(QFont("FontAwesome"));
        forwBtn->setText("\uF061");
        connect(forwBtn, &QToolButton::clicked, [=]() {
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
    QFileInfo presentationInfo = itemUrl().toLocalFile();

    m_slides.clear();
    foreach (QFileInfo entry, cacheDir().entryInfoList({"*.png"}, QDir::Files, QDir::Name)) {
        if (entry.lastModified() < presentationInfo.lastModified())
            return false;
        m_slides.append(entry.absoluteFilePath());
    }
    return (m_slides.length() > 0);
}

bool PowerPointViewer::loadSlidesFromPresentation()
{
    QString   presentationFile = itemUrl().toString();
    QAxObject pptApp;

    foreach (QString fileName, cacheDir().entryList())
        QFile::remove(cacheDir().absoluteFilePath(fileName));

    if (pptApp.setControl("PowerPoint.Application")) {
        QAxObject* presentations = pptApp.querySubObject("Presentations");

        if (presentations != NULL) {
            QAxObject* presentation = presentations->querySubObject("Open(QString)", presentationFile);

            if (presentation != NULL) {
                QAxObject* slides = presentation->querySubObject("Slides");

                if (slides != NULL) {
                    int count = slides->dynamicCall("Count()").toInt();

                    for (int i = 1; i <= count; ++i) {
                        QAxObject* slide     = slides->querySubObject("Item(int)", i);
                        QString    slidePath = cacheDir().absoluteFilePath(QString("%1.png").arg(i, 3, 10, QChar('0')));

                        if (slide != NULL)
                            slide->dynamicCall("Export(QString,QString)", "file:///" + slidePath, "png");
                    }
                    delete slides;
                }
                presentation->dynamicCall("Close()");
                delete presentation;
            }
            delete presentations;
        }
        pptApp.dynamicCall("Quit()");
        return loadSlidesFromCache();
    }
    return false;
}
