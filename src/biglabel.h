#ifndef BIGLABEL_H
#define BIGLABEL_H

#include <QLabel>

class BigLabel : public QLabel
{
    Q_OBJECT

    public:
        BigLabel(QWidget* parent = NULL);
        BigLabel(const QString& text, QWidget* parent = NULL);

    private:
        void setupUi();
};

#endif // BIGLABEL_H
