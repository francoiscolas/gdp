#include "biglabel.h"

BigLabel::BigLabel(QWidget* parent)
    : QLabel(parent)
{
    setupUi();
}

BigLabel::BigLabel(const QString& text, QWidget* parent)
    : QLabel(text, parent)
{
    setupUi();
}

void BigLabel::setupUi()
{
    setAlignment(Qt::AlignCenter);
    setFont(QFont(font().family(), 14, QFont::Bold));
    setForegroundRole(QPalette::Mid);
    setWordWrap(true);
}
