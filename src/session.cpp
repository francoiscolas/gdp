#include "session.h"

#include <QDebug>
#include <QFile>
#include <QSaveFile>
#include <QTimer>

#include "app.h"
#include "mainwindow.h"

static const quint32 s_magicNumber = 0x47645000; // GdP ASCII

Session::Session(const QString& file, QObject* parent)
    : QObject(parent),
      m_file(file)
{
    m_saveTimer = new QTimer(this);
    m_saveTimer->setInterval(1000);
    m_saveTimer->setSingleShot(true);
    connect(m_saveTimer, &QTimer::timeout, this, &Session::saveNow);
}

void Session::save()
{
    m_saveTimer->start();
}

void Session::saveNow()
{
    QSaveFile file(m_file);
    QByteArray state(saveState());

    if (file.open(QSaveFile::Truncate | QSaveFile::WriteOnly)
            && state.size() > 0) {
        file.write(state);
        file.commit();
    }
}

void Session::restore()
{
    QFile file(m_file);

    if (file.open(QFile::ReadOnly)) {
        restoreState(file.readAll());
        file.close();
    }
}

QByteArray Session::saveState() const
{
    MainWindow* mainWindow = gApp->mainWindow();

    if (mainWindow == NULL) {
        return QByteArray();
    } else {
        QByteArray state;
        QDataStream out(&state, QIODevice::WriteOnly);

        out << (quint32) s_magicNumber;
        out << (quint32) 1; // version
        out.setVersion(QDataStream::Qt_5_0);
        out << mainWindow->saveState();
        return state;
    }
}

void Session::restoreState(const QByteArray& state) const
{
    QDataStream in(state);
    MainWindow* mainWindow = gApp->mainWindow();

    quint32 magic; in >> magic;
    if (magic != s_magicNumber) {
        qCritical() << "Bad file format";
        return ;
    }

    quint32 version; in >> version;
    if (version == 1) {
        QByteArray ba;

        in.setVersion(QDataStream::Qt_5_0);
        in >> ba; mainWindow->restoreState(ba);
    } else {
        qCritical() << "Unknown state version";
    }
}

