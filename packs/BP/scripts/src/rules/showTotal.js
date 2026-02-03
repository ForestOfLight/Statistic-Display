import { BooleanRule } from "../../lib/canopy/CanopyExtension";
import Display from "../classes/Display";

class ShowTotal extends BooleanRule {
    constructor() {
        super({
            identifier: 'showTotal',
            description: 'Whether to show the total count in the statistic display.',
            defaultValue: true,
            onEnableCallback: () => Display.update(),
            onDisableCallback: () => Display.update()
        });
    }
}

export const showTotal = new ShowTotal();