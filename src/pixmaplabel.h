#ifndef PIXMAPLABEL_H
#define PIXMAPLABEL_H

#include <QWidget>

class PixmapLabel : public QWidget
{
    Q_OBJECT

    public:
        PixmapLabel(QWidget* parent = NULL);

    public:
        const QPixmap& pixmap() const;
        void setPixmap(const QPixmap& pixmap);

    protected:
        virtual void paintEvent(QPaintEvent* event);

    private:
        QPixmap m_pixmap;
};

#endif // PIXMAPLABEL_H
