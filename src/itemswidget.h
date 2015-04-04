#ifndef ITEMSWIDGET_H
#define ITEMSWIDGET_H

#include <QMimeType>
#include <QStandardItem>
#include <QStandardItemModel>
#include <QUrl>
#include <QWidget>

class QLineEdit;
class QListView;
class QSortFilterProxyModel;

class ItemsWidgetItem;
class ItemsWidgetModel;

class ItemsWidget : public QWidget
{
    Q_OBJECT

    public:
        ItemsWidget(QWidget* parent = NULL);

    public:
        QByteArray saveState() const;
        void restoreState(const QByteArray& state);

    protected:
        virtual void keyPressEvent(QKeyEvent* event);

    private:
        void setupUi();

    signals:
        void activated(const QUrl& url);

    private:
        QLineEdit* m_search;
        ItemsWidgetModel* m_model;
        QListView* m_listView;
        QSortFilterProxyModel* m_listModel;
};

class ItemsWidgetModel : public QStandardItemModel
{
    public:
        ItemsWidgetModel(QObject* parent = NULL);

    public:
        QByteArray saveState() const;
        void restoreState(const QByteArray& state);

    protected:
        virtual bool canDropMimeData(const QMimeData* data, Qt::DropAction action, int row, int column, const QModelIndex& parent) const;
        virtual bool dropMimeData(const QMimeData* data, Qt::DropAction action, int row, int column, const QModelIndex& parent);

        virtual QMimeData* mimeData(const QModelIndexList& indexes) const;
        virtual QStringList mimeTypes() const;
};

class ItemsWidgetItem : public QStandardItem
{
    public:
        ItemsWidgetItem(const QUrl& url);

        ItemsWidgetItem(const ItemsWidgetItem& other);
        ItemsWidgetItem& operator=(const ItemsWidgetItem& other);

    public:
        virtual QVariant data(int role) const;

        const QUrl& url() const;
        const QMimeType& mimeType() const;

    private:
        QUrl m_url;
        QMimeType m_mimeType;
};

#endif // ITEMSWIDGET_H
