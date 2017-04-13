import { CampaignTemplate } from './campaign';
import { LevelTemplateCreator, LevelTemplate,  } from '../levels/levelLibrary';
import { AdditionalInfo } from '../levels/additionalInfo';

const demoCampaign = new CampaignTemplate();
demoCampaign.maxPlayers = 2;
demoCampaign.minPlayers = 2;
demoCampaign.name = "Demo";

const map1 = LevelTemplateCreator.createLevel('1', '12\n34\n', new AdditionalInfo([], true));
const map2 = LevelTemplateCreator.createLevel('1', '1AB\n2 6\n3457\n9  8\n', new AdditionalInfo([], true));
const map3 = LevelTemplateCreator.createLevel('1', '123\n345\n', new AdditionalInfo([], true));

demoCampaign.levels = [map1, map2, map3];

export { demoCampaign };