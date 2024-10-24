import { Building } from "../models/building";

export class RatingService {
    private buildings: Map<string, Building[]>;

    public async getBuildings() {
        if (this.buildings) return this.buildings;
        
        this.buildings = new Map<string, Building[]>();
        const response = await fetch('/buildings.txt');
        const content = await response.text();

        let isTitle = false;
        let items: Building[];
        content.split('\n').forEach(line => {
            if (line === '') {
                isTitle = true;
            } else {
                if (isTitle) {
                    items = [];
                    this.buildings.set(line, items);
                    isTitle = false;
                } else {
                    const parts = line.split('|');
                    const name = parts[0];
                    const floors = Number(parts[1]);
                    const year = Number(parts[2]);
                    items.push({name, floors, year});
                }
            }
        });
        
        return this.buildings;
    }
}