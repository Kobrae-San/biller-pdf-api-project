"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
const pdfkit_1 = __importDefault(require("pdfkit"));
const PORT = 8888;
const app = (0, express_1.default)();
app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "http://localhost:5574");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});
app.use(express_1.default.json());
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: 5432,
});
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}.`);
});
app.post("/bill", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, address, country, city, zipcode, productname, price, quantity, tva, } = request.body;
    const doctype = "facture";
    try {
        const result = yield pool.query("INSERT INTO bill (doctype, firstname, lastname, address, country, city, zipcode, productname, price, quantity, tva) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id", [
            doctype,
            firstname,
            lastname,
            address,
            country,
            city,
            zipcode,
            productname,
            price,
            quantity,
            tva,
        ]);
        const lastId = result.rows[0].id;
        response.json({ message: "Bien reçu, bien reçu !", id: lastId });
    }
    catch (error) {
        console.error(`L'inscription de la facture dans la base de donnée a echoué: ${error}.`);
        response.json({
            message: `L'inscription de la facture dans la base de donnée a echoué.`,
        });
    }
}));
app.get("/bills", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const billsRequest = yield pool.query("SELECT id, doctype, firstname, lastname, address, country, city, zipcode, productname, price, quantity, tva, created_at FROM bill");
        const result = billsRequest.rows;
        response.json(result);
    }
    catch (error) {
        console.error(`La récupération des factures a échoué ${error}.`);
        response.json({ message: "La récupération des factures a échoué." });
    }
}));
app.get("/bills/bill", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.query;
    try {
        const billRequest = yield pool.query("SELECT id, doctype, firstname, lastname, address, country, city, zipcode, productname, price, quantity, tva, created_at FROM bill WHERE id = $1", [id]);
        const result = billRequest.rows;
        response.json(result);
    }
    catch (error) {
        console.error(`La récupération de la facture a échoué: ${error}.`);
        response.json({ message: "La récupération de la facture a échoué." });
    }
}));
app.get("/bills/bill/pdf", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.query;
    try {
        const billRequest = yield pool.query("SELECT id, doctype, firstname, lastname, address, country, city, zipcode, productname, price, quantity, tva, created_at FROM bill WHERE id = $1", [id]);
        const result = billRequest.rows[0];
        const doc = new pdfkit_1.default({
            size: "A4",
        });
        doc
            .fontSize(20)
            .text(`Facture de ${result.firstname} ${result.lastname}`, 50, 70);
        doc.fontSize(12).text(`${result.firstname} ${result.lastname}`, 50, 120);
        doc.fontSize(12).text(`${result.address}`, 50, 150);
        doc.fontSize(12).text(`${result.zipcode} ${result.city}`, 50, 180);
        doc.fontSize(14).text("Nom du Produit", 60, 210);
        doc.fontSize(14).text("Quantité", 210, 210);
        doc.fontSize(14).text("Prix", 360, 210);
        doc.fontSize(14).text("Total", 450, 210);
        doc.fontSize(12).text(`${result.productname}`, 60, 240);
        doc.fontSize(12).text(`${result.quantity}`, 250, 240);
        doc.fontSize(12).text(`${result.price}`, 355, 240);
        doc
            .fontSize(12)
            .text(`${(result.price * result.quantity).toFixed(2)}`, 445, 240);
        doc
            .fontSize(12)
            .text(`Sous-total ${(result.price * result.quantity).toFixed(2)}`, 385, 290);
        doc
            .fontSize(12)
            .text(`Tva (${result.tva}) % ${(result.quantity *
            result.price *
            (result.tva / 100)).toFixed(2)} €`, 370, 320);
        doc
            .fontSize(12)
            .text(`Montant Total ${(result.price *
            result.quantity *
            (1 + result.tva / 100)).toFixed(2)}`, 365, 350);
        response.setHeader("Content-Type", "application/pdf");
        doc.pipe(response);
        doc.end();
    }
    catch (error) {
        console.error(`La récupération de la facture a échoué: ${error}.`);
        response.json({ message: "La récupération de la facture a échoué." });
    }
}));
app.put("/bills/modify", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.query;
    const { firstname, lastname, address, country, city, zipcode, productname, price, quantity, tva, } = request.body;
    try {
        yield pool.query("UPDATE bill SET firstname = $1, lastname = $2, address = $3, country = $4, city = $5, zipcode = $6, productname = $7, price = $8, quantity = $9, tva = $10 WHERE id = $11", [
            firstname,
            lastname,
            address,
            country,
            city,
            zipcode,
            productname,
            price,
            quantity,
            tva,
            id,
        ]);
        response.json({ message: `Facture ${id} mise à jour avec succès` });
    }
    catch (error) {
        console.error(`Les données n'ont pas pu être modifié: ${error}.`);
        response.json({ message: "Les données n'ont pas pu être modifié" });
    }
}));
app.delete("/bills/bill", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.query;
    try {
        yield pool.query("DELETE FROM bill WHERE id = $1", [id]);
        response.json({ message: `Facture ${id} supprimée avec succès` });
    }
    catch (error) {
        console.error(`La facture n'a pas pu être supprimer: ${error}.`);
        response.json({ message: "La facture n'a pas pu être supprimée." });
    }
}));
