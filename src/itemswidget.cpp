#include "itemswidget.h"

#include <QApplication>
#include <QDrag>
#include <QDragEnterEvent>
#include <QLineEdit>
#include <QListView>
#include <QMessageBox>
#include <QMimeData>
#include <QMimeDatabase>
#include <QSortFilterProxyModel>
#include <QVBoxLayout>

#include "itemviewerfactory.h"

static const int SourceRole = Qt::UserRole + 1;
static const int SearchRole = Qt::UserRole + 2;

ItemsWidget::ItemsWidget(QWidget* parent)
    : QWidget(parent)
{
    setupUi();
}

QByteArray ItemsWidget::saveState() const
{
    QByteArray state;
    QDataStream out(&state, QIODevice::WriteOnly);

    out << (quint16) 1; // version
    out.setVersion(QDataStream::Qt_5_0);
    out << m_model->saveState();
    return state;
}

void ItemsWidget::restoreState(const QByteArray& state)
{
    QDataStream in(state);
    quint16 version;

    in >> version;
    if (version == 1) {
        QByteArray ba;

        in.setVersion(QDataStream::Qt_5_0);
        in >> ba; m_model->restoreState(ba);
    }
}

void ItemsWidget::keyPressEvent(QKeyEvent* event)
{
    if (event->key() == Qt::Key_Delete && m_listView->currentIndex().isValid()) {
        QString title = tr("Enlever le fichier");
        QString text  = tr("Voulez-vous vraiment enlever ce fichier de la liste ?");

        if (QMessageBox::question(this, title, text, QMessageBox::Yes, QMessageBox::No) == QMessageBox::Yes)
            m_model->removeRow(m_listModel->mapToSource(m_listView->currentIndex()).row());
        event->accept();
    }
    if (event->key() == Qt::Key_Escape/* && m_search == focusWidget()*/) {
        m_search->clear();
        event->accept();
    }
}

void ItemsWidget::setupUi()
{
    m_search = new QLineEdit(this);
    m_search->setPlaceholderText(tr("Recherche"));
    m_search->setClearButtonEnabled(true);

    m_model = new ItemsWidgetModel(this);

    m_listModel = new QSortFilterProxyModel(this);
    m_listModel->setSourceModel(m_model);
    m_listModel->setFilterCaseSensitivity(Qt::CaseInsensitive);
    m_listModel->setFilterRole(SearchRole);

    m_listView = new QListView(this);
    m_listView->setModel(m_listModel);
    m_listView->setDragDropMode(QListView::DragDrop);
    m_listView->setEditTriggers(QListView::NoEditTriggers);
    connect(m_listView, &QListView::activated, [=](const QModelIndex& index) {
        ItemsWidgetItem* item = dynamic_cast<ItemsWidgetItem*>(m_model->itemFromIndex(m_listModel->mapToSource(index)));

        if (item != NULL)
            emit activated(QUrl::fromLocalFile(item->target()));
    });

    QVBoxLayout* layout = new QVBoxLayout(this);
    layout->setContentsMargins(0, 0, 0, 0);
    layout->addWidget(m_search);
    layout->addWidget(m_listView);

    connect(m_model, &ItemsWidgetModel::rowsInserted, [=]() {
        m_listModel->sort(0);
    });
    connect(m_search, &QLineEdit::textChanged,
            m_listModel, &QSortFilterProxyModel::setFilterWildcard);
}

ItemsWidgetModel::ItemsWidgetModel(QObject* parent)
    : QStandardItemModel(parent)
{
}

QByteArray ItemsWidgetModel::saveState() const
{
    QByteArray state;
    QDataStream out(&state, QIODevice::WriteOnly);

    out << (quint16) 1; // version
    out.setVersion(QDataStream::Qt_5_0);
    out << (qint32) rowCount();
    for (int i = 0; i < rowCount(); ++i)
        out << data(index(i, 0), SourceRole).toString();
    return state;
}

void ItemsWidgetModel::restoreState(const QByteArray& state)
{
    QDataStream in(state);
    quint16 version;

    in >> version;
    if (version == 1) {
        qint32 count;

        in.setVersion(QDataStream::Qt_5_0);
        in >> count;
        for (int i = 0; i < count; ++i) {
            QString fp;

            in >> fp;
            if (QFileInfo::exists(fp)) {
                appendRow(new ItemsWidgetItem(fp));
            }
        }
    }
}

bool ItemsWidgetModel::canDropMimeData(const QMimeData* data, Qt::DropAction action, int row, int column, const QModelIndex& parent) const
{
    Q_UNUSED(row);
    Q_UNUSED(column);
    Q_UNUSED(parent);
    if (action == Qt::CopyAction) {
        foreach (const QUrl& url, data->urls()) {
            QString   target   = url.toLocalFile();
            QFileInfo targetFi = target;

            if (targetFi.isSymLink())
                target = targetFi.symLinkTarget();
            if (gItemViewerFactory->supports(target))
                return true;
        }
    }
    return false;
}

bool ItemsWidgetModel::dropMimeData(const QMimeData* data, Qt::DropAction action, int row, int column, const QModelIndex& parent)
{
    Q_UNUSED(row);
    Q_UNUSED(column);
    Q_UNUSED(parent);
    bool rowsAppended = false;

    if (action == Qt::CopyAction) {
        foreach (const QUrl& url, data->urls()) {
            ItemsWidgetItem item(url.toLocalFile());

            if (gItemViewerFactory->supports(item.target()) && findItems(item.text()).isEmpty()) {
                appendRow(new ItemsWidgetItem(item));
                rowsAppended = true;
            }
        }
    }
    return rowsAppended;
}

QMimeData* ItemsWidgetModel::mimeData(const QModelIndexList& indexes) const
{
    QMimeData*  mimeData = new QMimeData();
    QList<QUrl> urls;

    foreach (const QModelIndex& index, indexes) {
        if (index.isValid())
            urls.append(QUrl::fromLocalFile(data(index, SourceRole).toString()));
    }
    mimeData->setUrls(urls);
    return mimeData;
}

QStringList ItemsWidgetModel::mimeTypes() const
{
    return QStringList();
}

ItemsWidgetItem::ItemsWidgetItem(const QString& source)
    : QStandardItem()
{
    m_source = source;
    m_mimeType = QMimeDatabase().mimeTypeForFile(target());
}

ItemsWidgetItem::ItemsWidgetItem(const ItemsWidgetItem& other)
    : QStandardItem(other)
{
    *this = other;
}

ItemsWidgetItem& ItemsWidgetItem::operator=(const ItemsWidgetItem& other)
{
    m_source = other.m_source;
    m_mimeType = other.m_mimeType;
    return *this;
}

QVariant ItemsWidgetItem::data(int role) const
{
    if (role == Qt::DisplayRole || role == Qt::ToolTipRole) {
        return m_source.baseName();
    }
    if (role == Qt::DecorationRole) {
        return QIcon::fromTheme(m_mimeType.iconName());
    }
    if (role == SourceRole) {
        return m_source.absoluteFilePath();
    }
    if (role == SearchRole) {
        return data(Qt::DisplayRole).toString().normalized(QString::NormalizationForm_KD);
    }
    return QVariant();
}

QString ItemsWidgetItem::source() const
{
    return m_source.absoluteFilePath();
}

QString ItemsWidgetItem::target() const
{
    return (m_source.isSymLink()) ? m_source.symLinkTarget() : source();
}

const QMimeType& ItemsWidgetItem::mimeType() const
{
    return m_mimeType;
}
