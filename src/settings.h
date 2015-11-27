#ifndef SETTINGS_H
#define SETTINGS_H

#include <QObject>
#include <QSettings>
#include <QVariant>

#define SETTINGS_KEY_MAP(XX)    \
    XX(LibreOfficePath)         \
    XX(ImageMagickPath)         \
    XX(GhostScriptPath)         \

class Settings : public QObject
{
    Q_OBJECT

    public:
        enum Key {
#define XX(name) name,
            SETTINGS_KEY_MAP(XX)
#undef XX
        };

    public:
        Settings(const QString& file, QObject* parent = NULL);

    public:
        void detectDependencies();

        template<typename T>
        T value(Key key) const {
            return value(key).value<T>(); }

        QVariant value(Key key) const;
        void setValue(Key key, const QVariant& variant);

    private:
        QSettings m_settings;
};

#endif // SETTINGS_H
