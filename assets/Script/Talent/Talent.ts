/**
 * 天赋
 *
 * 根基、棍法、奇术、身法、毫毛、变化
 */
export abstract class Talent {
    /**
     * 名称
     */
    readonly name: string;

    /**
     * 显示名称
     */
    readonly displayName: string;

    /**
     * 需要的灵光点数
     */
    readonly requirement: number;

    /**
     * 最大等级
     *
     * 自动激活的天赋，最大等级为1级
     */
    readonly maxLevel: number;

    /**
     * 激活当前等级效果
     */
    protected abstract activateEffect(): void;

    /**
     * 取消激活当前效果
     */
    protected abstract deactivateEffect(): void;

    /**
     * 激活等级
     */
    private _level: number;

    protected constructor(name: string, displayName: string, requirement: number, maxLevel: number) {
        this.name = name;
        this.displayName = displayName;
        this.requirement = requirement;
        this.maxLevel = maxLevel;
        this._level = 0;
    }

    /**
     * 激活
     *
     * @param level 激活等级
     * @return 是否激活成功
     */
    activate(level: number): boolean {
        // TODO 添加处理灵光点逻辑

        if (this._level || !level) {
            this.deactivateEffect();
        }

        this._level = Math.max(0, Math.min(this.maxLevel, level));
        if (this._level) {
            this.activateEffect();
        }
        return true;
    }

    get level(): number {
        return this._level;
    }
}