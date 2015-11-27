#include "settings.h"

#include <QDir>
#include <QStandardPaths>

static const char* s_key_strings[] = {
#define XX(name) #name,
    SETTINGS_KEY_MAP(XX)
#undef XX
};

static QString s_findExecutable(const QString& name, const QStringList& patterns)
{
    QString path;

    path = QStandardPaths::findExecutable(name);
    if (path.isEmpty()) {
        QStringList paths;

        for (int i = 0; i < patterns.count(); ++i) {
            QStringList parts = QDir::fromNativeSeparators(patterns[i]).split("/", QString::SkipEmptyParts);
            QStringList p     = QStringList(parts[0]);

            for (int j = 1; j < parts.count(); ++j) {
                QStringList newp;

                for (int k = 0; k < p.count(); ++k) {
                    QStringList matches = QDir(p[k]).entryList(QStringList(parts[j]), QDir::Dirs);

                    for (int l = 0; l < matches.count(); ++l)
                        newp.append(p[k] + '/' + matches[l]);
                }
                newp.swap(p);
            }
            paths.append(p);
        }
        path = QStandardPaths::findExecutable(name, paths);
    }
    return path;
}

Settings::Settings(const QString& file, QObject* parent)
    : QObject(parent),
      m_settings(file, QSettings::IniFormat)
{
}

void Settings::detectDependencies()
{
    if (value<QString>(LibreOfficePath).isEmpty()) {
        QString path;

#ifdef Q_OS_WIN
        path = s_findExecutable("soffice", {
            "C:/Program Files*/LibreOffice*/program/"
        });
#else
        path = s_findExecutable("libreoffice");
#endif
        if (path.length() > 0) {
            setValue(LibreOfficePath, path);
        }
    }
    if (value<QString>(ImageMagickPath).isEmpty()) {
        QString path;

        path = s_findExecutable("convert", {
            "C:/Program Files*/ImageMagick-*/"
        });
        if (path.length() > 0) {
            setValue(ImageMagickPath, path);
        }
    }
    if (value<QString>(GhostScriptPath).isEmpty()) {
        QString path;

#ifdef Q_OS_WIN
        path = s_findExecutable("gswin32", {
            "C:/Program Files*/gs/gs*/bin/"
        });
#else
        path = s_findExecutable("gs");
#endif
        if (path.length() > 0) {
            setValue(GhostScriptPath, path);
        }
    }
}

QVariant Settings::value(Key key) const
{
    return m_settings.value(s_key_strings[key]);
}

void Settings::setValue(Key key, const QVariant& variant)
{
    m_settings.setValue(s_key_strings[key], variant);
}
