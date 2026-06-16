import { useEffect, useState } from 'react';
import { useUiStore } from '@/store';
import {
  Search,
  Filter,
  FileText,
  Download,
  User,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { auditLogs } from '@/mock';

export default function OperationAudit() {
  const { setCurrentPageTitle } = useUiStore();
  const [logs, setLogs] = useState(auditLogs);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    setCurrentPageTitle('操作审计');
  }, [setCurrentPageTitle]);

  const modules = ['全部模块', '资源接入', '级联管理', '告警管理', '用户管理', '系统设置', '视频上墙', '统计报表'];

  const filteredLogs = logs.filter(
    (log) => {
      const matchKeyword = log.userName.includes(searchKeyword) ||
        log.description.includes(searchKeyword) ||
        log.module.includes(searchKeyword);
      const matchModule = !moduleFilter || moduleFilter === '全部模块' || log.module === moduleFilter;
      return matchKeyword && matchModule;
    }
  );

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const typeColors: Record<string, string> = {
    '新增': 'text-success-400',
    '修改': 'text-primary-400',
    '删除': 'text-danger-400',
    '查看': 'text-gray-400',
    '登录': 'text-warning-400',
    '登出': 'text-gray-500',
    '导出': 'text-primary-300',
    '配置': 'text-purple-400',
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">今日操作</p>
          <p className="text-2xl font-bold text-white tabular-nums">128</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">成功</p>
          <p className="text-2xl font-bold text-success-400 tabular-nums">122</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">失败</p>
          <p className="text-2xl font-bold text-danger-400 tabular-nums">6</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-sm text-gray-400 mb-1">操作用户</p>
          <p className="text-2xl font-bold text-primary-400 tabular-nums">12</p>
        </div>
      </div>

      <div className="glass-card flex flex-col overflow-hidden flex-1">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="搜索操作人、操作内容..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-64 h-9 pl-10 pr-4 bg-dark-600/50 border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500/50 transition-colors"
              />
            </div>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="h-9 px-3 bg-dark-600/50 border border-white/10 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-primary-500/50"
            >
              {modules.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <button className="btn-secondary h-9 text-sm flex items-center gap-1.5">
              <Filter size={16} />
              高级筛选
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5">
              <Download size={16} />
              导出日志
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="table-header sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left font-medium">操作时间</th>
                <th className="px-4 py-3 text-left font-medium">操作人</th>
                <th className="px-4 py-3 text-left font-medium">所属组织</th>
                <th className="px-4 py-3 text-left font-medium">模块</th>
                <th className="px-4 py-3 text-left font-medium">操作类型</th>
                <th className="px-4 py-3 text-left font-medium">操作描述</th>
                <th className="px-4 py-3 text-left font-medium">IP地址</th>
                <th className="px-4 py-3 text-center font-medium">结果</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map((log) => (
                <tr key={log.id} className="table-row">
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {log.createTime}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-400/30 to-primary-600/30 flex items-center justify-center text-white text-xs">
                        {log.userName.charAt(0)}
                      </div>
                      <span className="text-gray-200">{log.userName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{log.orgName}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs bg-primary-500/10 text-primary-300">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={typeColors[log.action] || 'text-gray-400'}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300 max-w-xs truncate">
                    {log.description}
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                    {log.ip}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {log.result === 'success' ? (
                      <CheckCircle size={18} className="mx-auto text-success-400" />
                    ) : (
                      <XCircle size={18} className="mx-auto text-danger-400" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-sm text-gray-400">共 {filteredLogs.length} 条记录</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm bg-white/10 text-gray-300 rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上一页
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) {
                  page = currentPage - 2 + i;
                }
                if (currentPage > totalPages - 2) {
                  page = totalPages - 4 + i;
                }
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-sm rounded transition-colors ${
                    currentPage === page
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-sm bg-white/10 text-gray-300 rounded hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
