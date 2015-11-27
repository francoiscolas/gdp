#include "settingsdialog.h"

#include <QDialogButtonBox>
#include <QFileDialog>
#include <QLabel>
#include <QLineEdit>
#include <QPushButton>
#include <QVBoxLayout>

#include "settings.h"

SettingsDialog::SettingsDialog(QWidget* parent)
    : QDialog(parent),
      m_settings(NULL)
{
    m_loInput = new QLineEdit(this);

    QPushButton* loButton = new QPushButton(this);
    loButton->setText(tr("Parcourir..."));
    connect(loButton, &QPushButton::clicked, [=]() {
        QString path = QFileDialog::getOpenFileName(this);

        if (path.length() > 0)
            m_loInput->setText(path);
    });

    QHBoxLayout* loLayout = new QHBoxLayout();
    loLayout->addWidget(m_loInput);
    loLayout->addWidget(loButton);

    m_imInput = new QLineEdit(this);

    QPushButton* imButton = new QPushButton(this);
    imButton->setText(tr("Parcourir..."));
    connect(imButton, &QPushButton::clicked, [=]() {
        QString path = QFileDialog::getOpenFileName(this);

        if (path.length() > 0)
            m_imInput->setText(path);
    });

    QHBoxLayout* imLayout = new QHBoxLayout();
    imLayout->addWidget(m_imInput);
    imLayout->addWidget(imButton);

    m_gsInput = new QLineEdit(this);

    QPushButton* gsButton = new QPushButton(this);
    gsButton->setText(tr("Parcourir..."));
    connect(gsButton, &QPushButton::clicked, [=]() {
        QString path = QFileDialog::getOpenFileName(this);

        if (path.length() > 0)
            m_gsInput->setText(path);
    });

    QHBoxLayout* gsLayout = new QHBoxLayout();
    gsLayout->addWidget(m_gsInput);
    gsLayout->addWidget(gsButton);

    QDialogButtonBox* buttons = new QDialogButtonBox(this);
    buttons->addButton(QDialogButtonBox::Save);
    buttons->addButton(QDialogButtonBox::Cancel);
    connect(buttons, &QDialogButtonBox::accepted, this, &SettingsDialog::accept);
    connect(buttons, &QDialogButtonBox::rejected, this, &SettingsDialog::reject);

    QVBoxLayout* layout = new QVBoxLayout(this);
    layout->addWidget(new QLabel(tr("<b>LibreOffice:</b>"), this));
    layout->addLayout(loLayout);
    layout->addWidget(new QLabel(tr("<b>L'outil `convert` de ImageMagick:</b>"), this));
    layout->addLayout(imLayout);
    layout->addWidget(new QLabel(tr("<b>GhostScript:</b>"), this));
    layout->addLayout(gsLayout);
    layout->addStretch();
    layout->addWidget(buttons);

    setWindowTitle(tr("Paramètres"));
    setMinimumWidth(333);
}

void SettingsDialog::save()
{
    if (m_settings != NULL) {
        m_settings->setValue(Settings::LibreOfficePath, m_loInput->text());
        m_settings->setValue(Settings::ImageMagickPath, m_imInput->text());
        m_settings->setValue(Settings::GhostScriptPath, m_gsInput->text());
    }
}

Settings* SettingsDialog::settings() const
{
    return m_settings;
}

void SettingsDialog::setSettings(Settings* settings)
{
    m_settings = settings;
    if (m_settings != NULL) {
        m_loInput->setText(settings->value<QString>(Settings::LibreOfficePath));
        m_imInput->setText(settings->value<QString>(Settings::ImageMagickPath));
        m_gsInput->setText(settings->value<QString>(Settings::GhostScriptPath));
    }
}
