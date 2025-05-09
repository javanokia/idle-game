import { CraftRecipe } from "db://assets/Script/Recipe/CraftRecipe";
import { Storehouse } from "db://assets/Script/Storehouse/Storehouse";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { RecipeRequirement } from "db://assets/Script/Recipe/RecipeRequirement";
import { CRAFT_RECIPE_TABLE, UPGRADE_RECIPE_LIST } from "db://assets/Script/DataTable";
import { UpgradeRecipe } from "db://assets/Script/Recipe/UpgradeRecipe";
import { Equipment } from "db://assets/Script/Equipment/Equipment";
import { Gourd } from "db://assets/Script/Drink/Gourd/Gourd";
import { Liquor } from "db://assets/Script/Drink/Liquor/Liquor";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { UpdateEquipmentEvent } from "db://assets/Script/Event/Events/UpdateEquipmentEvent";
import { UpdateDrinkEvent } from "db://assets/Script/Event/Events/UpdateDrinkEvent";

/**
 * 配方工具
 */
export class RecipeUtil {
    /**
     * 可用的铸造配方列表
     */
    static availableCraftRecipes(): CraftRecipe[] {
        return Array.from(CRAFT_RECIPE_TABLE.values()).filter(recipe => this.canProduce(recipe));
    }

    /**
     * 可用的升阶配方列表
     */
    static availableUpgradeRecipes(): UpgradeRecipe[] {
        return UPGRADE_RECIPE_LIST.filter(recipe => {
            const material = Storehouse.STOREHOUSE.get(recipe.output.name)?.item as Equipment;
            return !!material && recipe.requireRarity === material.rankRarity;
        });
    }

    /**
     * 检查是否满足配方需求
     *
     * @param recipe 配方
     */
    static satisfy(recipe: CraftRecipe): boolean {
        return Storehouse.satisfy(this.requirementsToStacks(recipe.requirements));
    }

    /**
     * 检查产物是否能铸造
     *
     * @param recipe 配方
     * @return 是否能铸造
     */
    static canProduce(recipe: CraftRecipe): boolean {
        return !recipe.output.unique || !Storehouse.count(recipe.output); // 非唯一，或不存在
    }

    /**
     * 披挂铸造
     *
     * @param recipe 配方
     * @returns 成功与否
     */
    static craft(recipe: CraftRecipe) {
        const requirements = recipe.requirements.filter(requirement => requirement.consume);
        Storehouse.takeOut(this.requirementsToStacks(requirements));
        Storehouse.putIn([ItemStack.of(recipe.output, 1)]);

        if (recipe.output instanceof Equipment) {
            EventCenter.emit(EventName.UPDATE_EQUIPMENT, new UpdateEquipmentEvent(recipe.output as Equipment));
        } else if (recipe.output instanceof Gourd || recipe.output instanceof Liquor) {
            EventCenter.emit(EventName.UPDATE_DRINK, new UpdateDrinkEvent(recipe.output));
        }
    }

    /**
     * 披挂升阶
     *
     * @param recipe 配方
     * @return 成功与否
     */
    static upgrade(recipe: UpgradeRecipe) {
        const requirements = recipe.requirements.filter(requirement => requirement.consume);
        Storehouse.takeOut(this.requirementsToStacks(requirements));
        (recipe.output as Equipment).upgrade();
        return true;
    }

    /**
     * 将配方需求转换为物品堆叠
     *
     * @param requirements 配方需求列表
     * @return 物品堆叠列表
     */
    private static requirementsToStacks(requirements: RecipeRequirement[]): ItemStack[] {
        return requirements.map(requirement => ItemStack.of(requirement.item, requirement.count));
    }
}