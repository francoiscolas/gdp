#ifndef SESSION_H
#define SESSION_H

#include <QObject>

class Session : public QObject
{
    Q_OBJECT

    public:
        Session(const QString& file, QObject* parent = NULL);

    public:
        void save();
        void restore();

    private:
        QByteArray saveState() const;
        void restoreState(const QByteArray& state) const;

    private:
        QString m_file;
};
#endif // SESSION_H
