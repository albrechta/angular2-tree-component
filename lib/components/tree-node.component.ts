import { Component, Input, ViewEncapsulation, TemplateRef } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';

@Component({
  selector: 'TreeNode',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `.node-content-wrapper {
      display: inline-block;
      padding: 2px 5px;
      border-radius: 2px;
      transition: background-color .15s,box-shadow .15s;
    }`,
    '.node-wrapper {display: flex; align-items: flex-start;}',
    '.tree-node-active > .node-wrapper > .node-content-wrapper { background: #beebff }',
    '.tree-node-active.tree-node-focused > .node-wrapper > .node-content-wrapper { background: #beebff }',
    '.tree-node-focused > .node-wrapper > .node-content-wrapper { background: #e7f4f9 }',
    '.node-content-wrapper:hover { background: #f7fbff }',
    `.tree-node-active > .node-wrapper > .node-content-wrapper, .tree-node-focused > .node-content-wrapper, .node-content-wrapper:hover {
      box-shadow: inset 0 0 1px #999;
    }`,
    '.node-content-wrapper.is-dragging-over { background: #ddffee; box-shadow: inset 0 0 1px #999; }',
    '.node-content-wrapper.is-dragging-over-disabled { opacity: 0.5 }'
  ],
  template: `
    <div *mobxAutorun>
      <div
        *ngIf="!templates.treeNodeFullTemplate"
        class="tree-node tree-node-level-{{ node.level }}"
        [class]="node.getClass()"
        [class.tree-node-expanded]="node.isExpanded && node.hasChildren"
        [class.tree-node-collapsed]="node.isCollapsed && node.hasChildren"
        [class.tree-node-leaf]="node.isLeaf"
        [class.tree-node-active]="node.isActive"
        [class.tree-node-focused]="node.isFocused">

        <TreeNodeDropSlot *ngIf="index === 0" [dropIndex]="node.index" [node]="node.parent"></TreeNodeDropSlot>

          <div class="node-wrapper" [style.padding-left]="node.getNodePadding()">
            <TreeNodeExpander [node]="node"></TreeNodeExpander>
            <div class="node-content-wrapper"
              (click)="node.mouseAction('click', $event)"
              (dblclick)="node.mouseAction('dblClick', $event)"
              (contextmenu)="node.mouseAction('contextMenu', $event)"
              (treeDrop)="node.onDrop($event)"
              [treeAllowDrop]="node.allowDrop"
              [treeDrag]="node"
              [treeDragEnabled]="node.allowDrag()">

              <TreeNodeContent [node]="node" [index]="index" [template]="templates.treeNodeTemplate">
              </TreeNodeContent>
            </div>
          </div>

        <TreeNodeChildren [node]="node" [templates]="templates"></TreeNodeChildren>
        <TreeNodeDropSlot [dropIndex]="node.index + 1" [node]="node.parent"></TreeNodeDropSlot>
      </div>
      <template
        [ngTemplateOutlet]="templates.treeNodeFullTemplate"
        [ngOutletContext]="{ $implicit: node, node: node, index: index, templates: templates }">
      </template>
    </div>`
})

export class TreeNodeComponent {
  @Input() node: TreeNode;
  @Input() index: number;
  @Input() templates: any;

  constructor() {
  }

}
