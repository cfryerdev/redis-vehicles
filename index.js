import fs from "fs";

console.log('Loading Database ...');
import data from './_database.json';

console.log(`-- Found Rows: ${data.value.length}`);
console.log('-- Parsing Database ...');

const dataModel = [];
const include_meta_data = true;
const maxRows = -1; // -1 for all

data.value.forEach((row, i) => {    
    if (maxRows === -1 || i <= maxRows) {
        console.log(`---- Mutating vin: ${row.vin}`);
        const metaData = {};
        if (include_meta_data) {
            row.options && row.options.forEach((option) => { 
                const cat_name = option.category.toLowerCase().replace(' ', '_');
                if (metaData[cat_name] !== undefined) {
                    metaData[cat_name].push(option.option);
                } else {
                    metaData[cat_name] = [option.option];
                }
            });
        }
        dataModel.push({
            vin: row.vin,
            year: row.year,
            make: row.make,
            model: row.model,
            trim:  row.trim,
            price: row.price,
            type: row.vehicle_type,
            mileage: row.mileage,
            doors: row.doors,
            body: row.body,
            mpg: {
                city: row.mpg_city,
                highway: row.mpg_highway
            },
            is_new: row.newused !== "Used",
            certified_preowned: row.cpo.toLowerCase() === "true",
            colors: {
                exterior: row.exterior_color,
                exterior_detail: row.exterior_color_specific,
                interior: row.interior_color,
                interior_detail: row.interior_color_specific,
            },
            engine: {
                fuel: row.fuel,
                type: row.engine,
                cylinders: row.cylinders,
                displacement: parseFloat(row.displacement),
            },
            transmission: row.transmission,
            meta_data: metaData
        });
    }
});

console.log('-- Sorting database by year...');
dataModel.sort((a, b) => (a.year < b.year) ? 1 : -1);

console.log(`-- Writing output to vehicles.json (count: ${dataModel.length}) ...`);
let rawData = JSON.stringify(dataModel, null, 4);
fs.writeFileSync('_vehicles.json', rawData);

console.log('Finished!')