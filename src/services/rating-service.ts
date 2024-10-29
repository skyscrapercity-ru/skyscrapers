import { Building } from "../models/building";
declare var loadedBuildingsByWebpack: Map<string, Building[]>;

export class RatingService {
    public buildings: Map<string, Building[]> = loadedBuildingsByWebpack;
}