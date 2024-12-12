import { Area } from "db://assets/Script/Level/Area";
import { Stage } from "db://assets/Script/Level/Stage";
import { Item } from "db://assets/Script/Item/Item";
import { EnemyInfo } from "db://assets/Script/Entity/Enemy/EnemyInfo";
import { UniqueEffect } from "db://assets/Script/Item/Equipment/UniqueEffect/UniqueEffect";
import {
    UniqueEffectLinGunShuangShe
} from "db://assets/Script/Item/Equipment/UniqueEffect/UniqueEffectLinGunShuangShe";
import { SetEffect } from "db://assets/Script/Item/Equipment/SetEffect/SetEffect";
import { SetEffectZiZhuBiJiao } from "db://assets/Script/Item/Equipment/SetEffect/SetEffectZiZhuBiJiao";

/**
 * 道具表
 */
export const ITEM_TABLE = new Map<string, Item>();

/**
 * 敌人表
 */
export const ENEMY_TABLE = new Map<string, EnemyInfo>();

/**
 * 舞台表
 */
export const STAGE_TABLE = new Map<string, Stage>();

/**
 * 区域表
 */
export const AREA_TABLE = new Map<string, Area>();

/**
 * 独门妙用 Map
 *
 * 效果名 -> 效果对象
 */
export const UNIQUE_EFFECT_TABLE = new Map<string, UniqueEffect>();
UNIQUE_EFFECT_TABLE.set(UniqueEffectLinGunShuangShe.NAME, new UniqueEffectLinGunShuangShe());


/**
 * 套装效果 Map
 *
 * 效果名（装备名） -> 套装效果
 */
export const SET_EFFECT_TABLE = new Map<string, SetEffect>();
SET_EFFECT_TABLE.set(SetEffectZiZhuBiJiao.NAME, new SetEffectZiZhuBiJiao());