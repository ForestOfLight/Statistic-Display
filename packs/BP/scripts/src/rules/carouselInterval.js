import { FloatRule } from "../../lib/canopy/CanopyExtension";
import Carousel from "../classes/Carousel";

class CarouselInterval extends FloatRule {
    constructor() {
        super({
            identifier: 'carouselInterval',
            description: 'The interval in seconds to display each statistic in the statistic carousel.',
            defaultValue: 10,
            valueRange: { range: { min: 0.1, max: 3600.0 } },
            onModifyCallback: (seconds) => Carousel.setInterval(seconds)
        });
    }
}

export const carouselInterval = new CarouselInterval();