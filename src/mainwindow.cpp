#include "mainwindow.h"

#include <QApplication>
#include <QDesktopWidget>
#include <QHBoxLayout>
#include <QToolButton>

#include "itemswidget.h"
#include "itemviewer.h"
#include "itemviewerfactory.h"
#include "itemviewerscreen.h"
#include "itemviewerwrapper.h"

MainWindow::MainWindow(QWidget* parent)
    : QWidget(parent)
{
    setupUi();
    setAttribute(Qt::WA_QuitOnClose);
}

MainWindow::~MainWindow()
{
    delete m_screenWrapper;
    m_screenWrapper = NULL;
}

QByteArray MainWindow::saveState() const
{
    QByteArray state;
    QDataStream out(&state, QIODevice::WriteOnly);

    out << (quint16) 1; // version
    out.setVersion(QDataStream::Qt_5_0);
    out << saveGeometry();
    out << m_itemsWidget->saveState();
    return state;
}

void MainWindow::restoreState(const QByteArray& state)
{
    QDataStream in(state);
    quint16 version;

    in >> version;
    if (version == 1) {
        QByteArray ba;

        in.setVersion(QDataStream::Qt_5_0);
        in >> ba; restoreGeometry(ba);
        in >> ba; m_itemsWidget->restoreState(ba);
    }
}

void MainWindow::publish()
{
    ItemViewer* leftViewer = m_leftWrapper->itemViewer();

    if (leftViewer != NULL) {
        if (m_screenWrapper->isHidden()) {
            int currentScreen = qApp->desktop()->screenNumber(this);
            int screenCount   = qApp->desktop()->screenCount();
            int screen        = -1;

            for (int i = 0; i < screenCount && screen == -1; ++i) {
                if (i != currentScreen)
                    screen = i;
            }
            if (screen > -1) {
                m_screenWrapper->move(qApp->desktop()->screenGeometry(screen).center());
                qApp->processEvents();
                m_screenWrapper->showMaximized();
                qApp->processEvents();
                m_screenWrapper->showFullScreen();
            }
        }

        m_screenWrapper->setItemViewer(leftViewer->clone());

        m_rightWrapper->setItemViewer(leftViewer->clone());
        m_rightWrapper->itemViewer()->setBuddy(m_screenWrapper->itemViewer());
    }
}

void MainWindow::resizeEvent(QResizeEvent* event)
{
    QWidget::resizeEvent(event);
    updateLayout();
}

void MainWindow::setupUi()
{
    m_itemsWidget = new ItemsWidget(this);
    m_itemsWidget->setMaximumWidth(300);

    m_leftWrapper = new ItemViewerWrapper(this);
    m_leftWrapper->setPlaceholder(tr("Glissez-déposez ici un fichier ou un élément de la liste ci-contre."));
    m_leftWrapper->setAcceptDrops(true);

    m_rightWrapper = new ItemViewerWrapper(this);

    m_screenWrapper = new ItemViewerScreen();
    m_screenWrapper->hide();

    m_publishBtn = new QToolButton(this);
    m_publishBtn->setFont(QFont("FontAwesome", 20));
    m_publishBtn->setText(tr("\uF178"));
    m_publishBtn->setMaximumWidth(m_publishBtn->fontMetrics().averageCharWidth() * 2);
    connect(m_publishBtn, &QToolButton::clicked, this, &MainWindow::publish);

    QHBoxLayout* layout = new QHBoxLayout(this);
    layout->addWidget(m_itemsWidget, 1);
    layout->addWidget(m_leftWrapper, 2);
    layout->addWidget(m_rightWrapper, 2);

    connect(m_itemsWidget, &ItemsWidget::activated, [=](const QUrl& url) {
        m_leftWrapper->setItemViewer(gItemViewerFactory->create(url));
    });

    updateLayout();
}

void MainWindow::updateLayout()
{
    QRect lwRect = m_leftWrapper->geometry();
    QRect rwRect = m_rightWrapper->geometry();
    int   w      = rwRect.right() - lwRect.left();
    int   x      = lwRect.x() + w / 2 - m_publishBtn->width() / 2 + 2;
    int   y      = lwRect.center().y();

    m_publishBtn->move(x, y);
}
