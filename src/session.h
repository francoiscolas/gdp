#ifndef SESSION_H
#define SESSION_H

#include <QObject>

class QTimer;

class Session : public QObject
{
    Q_OBJECT

    public:
        Session(const QString& file, QObject* parent = NULL);

    public:
        void save();
        void saveNow();
        void restore();

    private:
        QByteArray saveState() const;
        void restoreState(const QByteArray& state) const;

    private:
        QTimer* m_saveTimer;
        QString m_file;
};
#endif // SESSION_H
