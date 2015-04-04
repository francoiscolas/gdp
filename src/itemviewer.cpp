#include "itemviewer.h"

#include <QCryptographicHash>
#include <QHBoxLayout>
#include <QIcon>
#include <QLabel>
#include <QMimeDatabase>
#include <QVBoxLayout>

#include "app.h"

ItemViewer::ItemViewer(const QUrl& itemUrl, QWidget* parent)
    : QWidget(parent),
      m_itemUrl(itemUrl),
      m_buddy(NULL)
{
    setupUi();
}

QDir ItemViewer::cacheDir() const
{
    QString hashedItemUrl = QCryptographicHash::hash(m_itemUrl.toString().toLatin1(), QCryptographicHash::Md5).toHex();
    QDir dir = QString("%1/cache/%2/%3")
            .arg(gApp->dataDir().absolutePath())
            .arg(metaObject()->className())
            .arg(hashedItemUrl);

    if (dir.exists() == false)
        dir.mkpath(dir.absolutePath());
    return dir;
}

const QUrl& ItemViewer::itemUrl() const
{
    return m_itemUrl;
}

ItemViewer* ItemViewer::buddy() const
{
    return m_buddy;
}

void ItemViewer::setBuddy(ItemViewer* buddy)
{
    m_buddy = buddy;
}

bool ItemViewer::isControlsVisible() const
{
    return m_controlsLayout->parentWidget()->isVisible();
}

void ItemViewer::setControlsVisible(bool visible)
{
    m_headerLayout->parentWidget()->setVisible(visible);
    m_controlsLayout->parentWidget()->setVisible(visible);
}

void ItemViewer::showControls()
{
    setControlsVisible(true);
}

void ItemViewer::hideControls()
{
    setControlsVisible(false);
}

ItemViewer* ItemViewer::clone() const
{
    QObject*    qo = metaObject()->newInstance(Q_ARG(QUrl, itemUrl()));
    ItemViewer* iv = static_cast<ItemViewer*>(qo);

    if (iv != NULL)
        iv->restoreState(saveState());
    return iv;
}

QVBoxLayout* ItemViewer::contentLayout() const
{
    return m_contentLayout;
}

QHBoxLayout* ItemViewer::controlsLayout() const
{
    return m_controlsLayout;
}

void ItemViewer::setupUi()
{
    QMimeType mimeType = QMimeDatabase().mimeTypeForFile(itemUrl().toString());

    QWidget* headerWidget = new QWidget(this);
    headerWidget->setAutoFillBackground(true);
    headerWidget->setBackgroundRole(QPalette::Dark);

    QLabel* iconLabel = new QLabel(this);
    iconLabel->setPixmap(QIcon::fromTheme(mimeType.iconName()).pixmap(QSize(24,24)));

    QLabel* textLabel = new QLabel(this);
    textLabel->setText(QFileInfo(itemUrl().toString()).baseName());

    QWidget* controlsWidget = new QWidget(this);

    m_headerLayout = new QHBoxLayout(headerWidget);
    m_headerLayout->addWidget(iconLabel);
    m_headerLayout->addWidget(textLabel);
    m_headerLayout->addStretch(1);

    m_contentLayout = new QVBoxLayout();

    m_controlsLayout = new QHBoxLayout(controlsWidget);

    QVBoxLayout* layout = new QVBoxLayout(this);
    layout->addWidget(headerWidget);
    layout->addLayout(m_contentLayout);
    layout->addWidget(controlsWidget);
}
