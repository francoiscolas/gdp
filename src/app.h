#ifndef APP_H
#define APP_H

#include <QApplication>
#include <QDir>

#define gApp (static_cast<App*>(QCoreApplication::instance()))

class MainWindow;
class Session;
class Settings;

class App : public QApplication
{
    public:
        App(int argc, char** argv);

    public:
        QDir dataDir() const;
        MainWindow* mainWindow() const;
        Session* session() const;
        Settings* settings() const;

    private:
        MainWindow* m_mainWindow;
        Session* m_session;
        Settings* m_settings;
};

#endif // APP_H
