#include "itemviewerscreen.h"

#include "itemviewer.h"

ItemViewerScreen::ItemViewerScreen(QWidget* parent)
    : ItemViewerWrapper(parent)
{
    setAttribute(Qt::WA_QuitOnClose, false);
    setStyleSheet("background-color: black;");
}

void ItemViewerScreen::setItemViewer(ItemViewer* itemViewer)
{
    ItemViewerWrapper::setItemViewer(itemViewer);

    if (itemViewer != NULL)
        itemViewer->hideControls();
}
