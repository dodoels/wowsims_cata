// Configuration for spec-specific UI elements on the settings tab.
// These don't need to be in a separate file but it keeps things cleaner.
import * as InputHelpers from '../../core/components/input_helpers.js';
import { Player } from '../../core/player';
import { Profession, Spec, Stat } from '../../core/proto/common.js';
import { WarlockOptions } from '../../core/proto/warlock';
import { Stats } from '../../core/proto_utils/stats';

const calculatePrepullMasteryBonus = (options: WarlockOptions, player: Player<Spec.SpecDemonologyWarlock>): Stats => {
	let bonusStats = new Stats();

	if (options.useItemSwapBonusStats) {
		bonusStats = bonusStats.addStat(Stat.StatMasteryRating, 225 + (player.hasProfession(Profession.Alchemy) ? 40 : 0));
	}

	return bonusStats;
};

export const AssumePrepullMasteryElixir = InputHelpers.makeClassOptionsBooleanInput<Spec.SpecDemonologyWarlock>({
	fieldName: 'useItemSwapBonusStats',
	label: 'Assume Prepull Mastery Elixir',
	labelTooltip: 'Enabling this assumes you are using a Mastery Elixir during prepull.',
	getValue: player => player.getClassOptions().useItemSwapBonusStats,
	setValue: (eventID, player, newVal) => {
		const newOptions = player.getClassOptions();
		newOptions.useItemSwapBonusStats = newVal;

		const bonusStats = calculatePrepullMasteryBonus(newOptions, player);

		player.itemSwapSettings.setBonusStats(eventID, bonusStats);
		player.setClassOptions(eventID, newOptions);
	},
});
