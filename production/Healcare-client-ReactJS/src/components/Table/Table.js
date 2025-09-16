import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import "./Table.scss";

class Table extends Component {
  render() {
    const { 
      data = [], 
      columns = [], 
      title = "", 
      actions = [],
      showIndex = true,
      striped = true,
      hover = true,
      loading = false,
      emptyMessage = "No data available"
    } = this.props;

    return (
      <div className="table-container">
        {title && (
          <div className="table-header">
            <h3 className="table-title">{title}</h3>
          </div>
        )}
        
        {loading ? (
          <div className="table-loading">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className={`data-table ${striped ? 'striped' : ''} ${hover ? 'hover' : ''}`}>
              <thead>
                <tr>
                  {showIndex && <th className="index-col">#</th>}
                  {columns.map((column, index) => (
                    <th 
                      key={index} 
                      className={column.className || ''}
                      style={column.width ? { width: column.width } : {}}
                    >
                      {typeof column.title === 'string' ? (
                        <FormattedMessage 
                          id={column.title} 
                          defaultMessage={column.title}
                        />
                      ) : (
                        column.title
                      )}
                    </th>
                  ))}
                  {actions.length > 0 && <th className="actions-col">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((item, rowIndex) => (
                    <tr key={rowIndex} className="table-row">
                      {showIndex && (
                        <td className="index-cell">{rowIndex + 1}</td>
                      )}
                      {columns.map((column, colIndex) => (
                        <td key={colIndex} className={column.className || ''}>
                          {column.render ? 
                            column.render(item[column.dataIndex], item, rowIndex) : 
                            item[column.dataIndex] || '-'
                          }
                        </td>
                      ))}
                      {actions.length > 0 && (
                        <td className="actions-cell">
                          <div className="action-buttons">
                            {actions.map((action, actionIndex) => (
                              <button
                                key={actionIndex}
                                className={`btn-action ${action.type || 'primary'}`}
                                onClick={() => action.onClick && action.onClick(item, rowIndex)}
                                disabled={action.disabled && action.disabled(item)}
                                title={action.title}
                              >
                                {action.icon && <i className={action.icon}></i>}
                                {action.label && (
                                  <span>
                                    {typeof action.label === 'string' ? (
                                      <FormattedMessage 
                                        id={action.label} 
                                        defaultMessage={action.label}
                                      />
                                    ) : (
                                      action.label
                                    )}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan={
                        (showIndex ? 1 : 0) + 
                        columns.length + 
                        (actions.length > 0 ? 1 : 0)
                      }
                      className="empty-cell"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default Table;