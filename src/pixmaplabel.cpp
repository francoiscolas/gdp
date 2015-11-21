#include "pixmaplabel.h"

#include <QPainter>

PixmapLabel::PixmapLabel(QWidget* parent)
    : QWidget(parent)
{
}

const QPixmap& PixmapLabel::pixmap() const
{
    return m_pixmap;
}

void PixmapLabel::setPixmap(const QPixmap& pixmap)
{
    m_pixmap = pixmap;
    update();
}

void PixmapLabel::paintEvent(QPaintEvent* event)
{
    QWidget::paintEvent(event);

    if (m_pixmap.isNull() == false) {
        QRect pixmapRect;
        pixmapRect.setSize(m_pixmap.size().scaled(size(), Qt::KeepAspectRatio));
        pixmapRect.moveCenter(contentsRect().center());

        QPainter painter(this);
        painter.drawPixmap(pixmapRect, m_pixmap.scaled(pixmapRect.size(), Qt::KeepAspectRatio, Qt::SmoothTransformation));
    }
}
