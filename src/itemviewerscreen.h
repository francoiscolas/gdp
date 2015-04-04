#ifndef ITEMVIEWERSCREEN_H
#define ITEMVIEWERSCREEN_H

#include "itemviewerwrapper.h"

class ItemViewerScreen : public ItemViewerWrapper
{
    public:
        ItemViewerScreen(QWidget* parent = NULL);

    public:
        virtual void setItemViewer(ItemViewer* itemViewer);
};

#endif // ITEMVIEWERSCREEN_H
