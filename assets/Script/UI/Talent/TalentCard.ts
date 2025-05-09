import { _decorator, Component, Label, Layout, Node, UITransform, Vec3, view } from 'cc';
import { TalentTreeNode } from "db://assets/Script/Talent/TalentTreeNode";
import { EventCenter } from "db://assets/Script/Event/EventCenter";

import { EventName } from "db://assets/Script/Event/EventName";

const { ccclass } = _decorator;

/**
 * 天赋卡片
 */
@ccclass('TalentCard')
export class TalentCard extends Component {
    /**
     * 天赋树节点
     */
    private _talentTreeNode: TalentTreeNode;

    /**
     * 自身 Transform
     */
    private _transform: UITransform;

    /**
     * 天赋名称 Label
     */
    private _nameLabel: Label;

    /**
     * 天赋等级节点
     */
    private _levelNode: Node;

    /**
     * 天赋等级 Label
     */
    private _levelLabel: Label;

    /**
     * 升级需求节点
     */
    private _requirementNode: Node;

    /**
     * 升级需求 Label
     */
    private _requirementLabel: Label;

    /**
     * 天赋描述 Label
     */
    private _descriptionLabel: Label;

    /**
     * 操作节点
     */
    private _operationNode: Node;

    onLoad() {
        this._transform = this.node.getComponent(UITransform);
        this._nameLabel = this.node.getChildByName("Name").getComponent(Label);
        this._levelNode = this.node.getChildByName("Level");
        this._levelLabel = this._levelNode.getComponent(Label);
        this._requirementNode = this.node.getChildByName("Requirement");
        this._requirementLabel = this._requirementNode.getComponent(Label);
        this._descriptionLabel = this.node.getChildByName("Description").getComponent(Label);
        this._operationNode = this.node.getChildByName("Operation");
    }

    update(_dt: number) {
        // 更新 Layout
        this.getComponent(Layout).updateLayout(true);
    }

    show(targetWorldPosition: Vec3, talentTreeNode: TalentTreeNode) {
        this.node.active = true;

        // 设置卡片位置与锚点
        const resolutionSize = view.getDesignResolutionSize();
        this._transform.anchorX = targetWorldPosition.x + this._transform.width <= resolutionSize.width ? 0 : 1;
        this._transform.anchorY = targetWorldPosition.y - this._transform.height >= 0 ? 1 : 0;
        this.node.setWorldPosition(targetWorldPosition);

        // 设置卡片内容
        this._talentTreeNode = talentTreeNode;
        this._nameLabel.string = talentTreeNode.talent.displayName;
        this._levelNode.active = !talentTreeNode.locked; // 只在解锁后显示等级
        this._levelLabel.string = `Lv.${talentTreeNode.talent.level}`;
        this._requirementNode.active = !talentTreeNode.maxActivated();
        this._requirementLabel.string = `需要点数：${talentTreeNode.talent.requirement}`;
        this._descriptionLabel.string = talentTreeNode.talent.description;
        this._operationNode.active = !talentTreeNode.locked && !talentTreeNode.maxActivated(); // 只在未锁定未到最大等级时显示操作按钮

        // 更新 Layout
        this.getComponent(Layout).updateLayout(true);
    }

    clickCard() {
        this.hide();
    }

    clickbutton() {
        EventCenter.emit(EventName.TALENT_UPGRADE, this._talentTreeNode);

        this._levelLabel.string = `Lv.${this._talentTreeNode.talent.level}`;

        if (this._talentTreeNode.maxActivated()) {
            this._operationNode.active = false;
            this._requirementNode.active = false;
            this.getComponent(Layout).updateLayout(true);
        }

        EventCenter.emit(EventName.UI_UPDATE_TALENT_SLOT, this._talentTreeNode);
    }

    /**
     * 隐藏
     */
    hide() {
        this.node.active = false;
    }
}
