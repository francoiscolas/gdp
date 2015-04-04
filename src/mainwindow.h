#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QWidget>

class QToolButton;

class ItemViewerWrapper;
class ItemsWidget;

class MainWindow : public QWidget
{
    Q_OBJECT

    public:
        MainWindow(QWidget* parent = NULL);
        virtual ~MainWindow();

    public:
        QByteArray saveState() const;
        void restoreState(const QByteArray& state);

        void publish();

    protected:
        virtual void resizeEvent(QResizeEvent* event);

    private:
        void setupUi();
        void updateLayout();

    private:
        ItemsWidget* m_itemsWidget;
        ItemViewerWrapper* m_leftWrapper;
        ItemViewerWrapper* m_rightWrapper;
        ItemViewerWrapper* m_screenWrapper;
        QToolButton* m_publishBtn;
};

#endif // MAINWINDOW_H
