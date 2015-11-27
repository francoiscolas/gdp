#ifndef SETTINGSDIALOG_H
#define SETTINGSDIALOG_H

#include <QDialog>

class Settings;

class QLineEdit;

class SettingsDialog : public QDialog
{
    public:
        SettingsDialog(QWidget* parent = NULL);

    public:
        void save();

        Settings* settings() const;
        void setSettings(Settings* settings);

    private:
        Settings* m_settings;
        QLineEdit* m_loInput;
        QLineEdit* m_imInput;
        QLineEdit* m_gsInput;
};

#endif // SETTINGSDIALOG_H
