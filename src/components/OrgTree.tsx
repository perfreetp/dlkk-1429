import { ChevronRight, Building2, Video } from 'lucide-react';
import { useOrgStore } from '@/store';
import { useEffect } from 'react';
import type { Organization } from '@/types';

interface OrgTreeProps {
  onSelect?: (org: Organization) => void;
  showDeviceCount?: boolean;
}

function TreeNode({
  org,
  level = 0,
  expandedOrgs,
  selectedOrgId,
  onToggle,
  onSelect,
  showDeviceCount,
}: {
  org: Organization;
  level?: number;
  expandedOrgs: Set<string>;
  selectedOrgId: string;
  onToggle: (id: string) => void;
  onSelect?: (org: Organization) => void;
  showDeviceCount?: boolean;
}) {
  const hasChildren = org.children && org.children.length > 0;
  const isExpanded = expandedOrgs.has(org.id);
  const isSelected = selectedOrgId === org.id;
  const onlineRate = org.deviceCount > 0 ? Math.round((org.onlineCount / org.deviceCount) * 100) : 0;

  return (
    <div>
      <div
        className={`flex items-center py-2 px-2 cursor-pointer rounded-lg transition-colors ${
          isSelected
            ? 'bg-primary-500/20 text-white'
            : 'text-gray-300 hover:bg-white/5 hover:text-white'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect?.(org)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(org.id);
            }}
            className="p-0.5 mr-1 text-gray-500 hover:text-white transition-colors"
          >
            <ChevronRight
              size={14}
              className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
            />
          </button>
        ) : (
          <span className="w-5" />
        )}

        <Building2 size={16} className="mr-2 text-primary-400" />

        <span className="flex-1 text-sm truncate">{org.name}</span>

        {showDeviceCount && org.deviceCount > 0 && (
          <span className="text-xs text-gray-500 ml-2">
            <span className="text-success-400">{org.onlineCount}</span>
            <span className="mx-0.5">/</span>
            <span>{org.deviceCount}</span>
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div>
          {org.children!.map((child) => (
            <TreeNode
              key={child.id}
              org={child}
              level={level + 1}
              expandedOrgs={expandedOrgs}
              selectedOrgId={selectedOrgId}
              onToggle={onToggle}
              onSelect={onSelect}
              showDeviceCount={showDeviceCount}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrgTree({ onSelect, showDeviceCount = true }: OrgTreeProps) {
  const { orgTree, expandedOrgs, selectedOrgId, toggleOrgExpanded, setSelectedOrg, fetchOrgTree } =
    useOrgStore();

  useEffect(() => {
    fetchOrgTree();
  }, [fetchOrgTree]);

  const handleSelect = (org: Organization) => {
    setSelectedOrg(org.id);
    onSelect?.(org);
  };

  return (
    <div className="h-full overflow-y-auto">
      {orgTree.map((org) => (
        <TreeNode
          key={org.id}
          org={org}
          expandedOrgs={expandedOrgs}
          selectedOrgId={selectedOrgId}
          onToggle={toggleOrgExpanded}
          onSelect={handleSelect}
          showDeviceCount={showDeviceCount}
        />
      ))}
    </div>
  );
}
