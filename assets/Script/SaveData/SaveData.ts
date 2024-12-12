import { Storehouse } from "db://assets/Script/Util/StorehouseUtil";
import { ItemStackJson } from "db://assets/Script/Item/ItemStackJson";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { Equipment, EquipmentType } from "db://assets/Script/Item/Equipment/Equipment";
import { SaveDataJson } from "db://assets/Script/SaveData/SaveDataJson";

import { ITEM_TABLE } from "db://assets/Script/DataTable";
import { DefaultLevelName } from "db://assets/Script/Util/Constant";

/**
 * 存档数据
 */
export class SaveData {
    /**
     * 等级
     */
    level: number;

    /**
     * 经验
     */
    experience: number;

    /**
     * 金币
     */
    coin: number;

    /**
     * 装备槽
     */
    equipmentSlot: Map<EquipmentType, ItemStack>;

    /**
     * 仓库
     */
    storehouse: Storehouse;

    /**
     * 区域名称
     */
    areaName: string;

    /**
     * 舞台名称
     */
    stageName: string;

    constructor(level: number, experience: number, coin: number, equipmentSlot: Map<EquipmentType, ItemStack>, storehouse: Storehouse, areaName: string, stageName: string) {
        this.level = level ?? 0;
        this.experience = experience ?? 0;
        this.coin = coin ?? 0;
        this.equipmentSlot = equipmentSlot ?? new Map<EquipmentType, ItemStack>();
        this.storehouse = storehouse ?? new Map<string, ItemStack>();
        this.areaName = areaName ?? DefaultLevelName.AREA;
        this.stageName = stageName ?? DefaultLevelName.STAGE;
    }

    /**
     * 从JSON创建存档数据
     *
     * @param json 存档数据JSON
     * @return 存档数据
     */
    static fromJson(json: string): SaveData {
        const dataJson = JSON.parse(json) as SaveDataJson;
        const equipmentSlot = new Map<EquipmentType, ItemStack>(dataJson.equipmentSlot
            .map(stackJson => {
                const equipment = ITEM_TABLE.get(stackJson.itemName) as Equipment;
                return [equipment.equipmentType, new ItemStack(equipment, 1)];
            }));
        const storehouse = new Map<string, ItemStack>(dataJson.storehouse
            .map(itemStackJson => [itemStackJson.itemName, ItemStackJson.toItemStack(itemStackJson)]));
        return new SaveData(dataJson.level, dataJson.experience, dataJson.coin, equipmentSlot, storehouse, dataJson.areaName, dataJson.stageName);
    }

    /**
     * 转为JSON
     */
    toJson(): string {
        const equipmentSlotJson = Array.from(this.equipmentSlot.values())
            .filter(stack => stack.item)
            .map(item => new ItemStackJson(item.item.name, item.count));
        const storehouseJson = Array.from(this.storehouse.values())
            .map(item => new ItemStackJson(item.item.name, item.count));
        return new SaveDataJson(this.level, this.experience, this.coin, equipmentSlotJson, storehouseJson, this.areaName, this.stageName).toJson();
    }
}

