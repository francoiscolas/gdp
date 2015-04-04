#ifndef ITEMVIEWERWRAPPER_H
#define ITEMVIEWERWRAPPER_H

#include <QFrame>

class QStackedLayout;

class BigLabel;
class ItemViewer;

class ItemViewerWrapper : public QFrame
{
    public:
        ItemViewerWrapper(QWidget* parent = NULL);

    public:
        QString placeholder() const;
        void setPlaceholder(const QString& placeholder);

        ItemViewer* itemViewer() const;
        virtual void setItemViewer(ItemViewer* itemViewer);

    protected:
        virtual void dragEnterEvent(QDragEnterEvent* event);
        virtual void dropEvent(QDropEvent* event);

    private:
        void setupUi();

    private:
        QStackedLayout* m_stack;
        BigLabel* m_placeholder;
        ItemViewer* m_itemViewer;
};

#endif // ITEMVIEWERWRAPPER_H
