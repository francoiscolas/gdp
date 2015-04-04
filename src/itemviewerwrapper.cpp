#include "itemviewerwrapper.h"

#include <QDragEnterEvent>
#include <QMimeData>
#include <QStackedLayout>

#include "biglabel.h"
#include "itemviewer.h"
#include "itemviewerfactory.h"

ItemViewerWrapper::ItemViewerWrapper(QWidget* parent)
    : QFrame(parent),
      m_itemViewer(NULL)
{
    setupUi();
}

QString ItemViewerWrapper::placeholder() const
{
    return m_placeholder->text();
}

void ItemViewerWrapper::setPlaceholder(const QString& placeholder)
{
    m_placeholder->setText(placeholder);
}

ItemViewer* ItemViewerWrapper::itemViewer() const
{
    return m_itemViewer;
}

void ItemViewerWrapper::setItemViewer(ItemViewer* itemViewer)
{
    if (m_itemViewer != NULL) {
        delete m_itemViewer;
        m_itemViewer = NULL;
    }

    m_itemViewer = itemViewer;
    m_itemViewer->setParent(this);
    m_stack->addWidget(m_itemViewer);
    m_stack->setCurrentWidget(m_itemViewer);
}

void ItemViewerWrapper::dragEnterEvent(QDragEnterEvent* event)
{
    if (event->dropAction() != Qt::CopyAction)
        return ;

    foreach (const QUrl& url, event->mimeData()->urls()) {
        if (gItemViewerFactory->supports(url)) {
            event->accept();
            break;
        }
    }
}

void ItemViewerWrapper::dropEvent(QDropEvent* event)
{
    if (event->dropAction() != Qt::CopyAction)
        return ;

    foreach (const QUrl& url, event->mimeData()->urls()) {
        ItemViewer* iv = gItemViewerFactory->create(url);

        if (iv != NULL) {
            setItemViewer(iv);
            event->accept();
            break;
        }
    }
}

void ItemViewerWrapper::setupUi()
{
    setFrameShape(QFrame::StyledPanel);

    m_placeholder = new BigLabel(this);

    m_stack = new QStackedLayout(this);
    m_stack->addWidget(m_placeholder);
}
