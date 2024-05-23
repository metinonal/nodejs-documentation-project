const db = require('../data/db');

exports.adminPage = async (req, res) => {
    try {
        const [documents] = await db.execute("SELECT *, DATE_FORMAT(documentDate, '%d.%m.%Y') AS formattedDate FROM documents");
        const [parentDocuments] = await db.execute("SELECT *, DATE_FORMAT(documentDate, '%d.%m.%Y') AS formattedDate FROM documents WHERE parentDocumentID IS NULL");

        res.render("admin", {
            documents: documents,
            parentDocuments: parentDocuments
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
};

exports.deleteDocument = async (req, res) => {
    const documentID = req.params.documentID;

    try {
        const [referencedDocs] = await db.execute("SELECT * FROM documents WHERE parentDocumentID = ?", [documentID]);

        if (referencedDocs.length > 0) {
            for (const doc of referencedDocs) {
                await db.execute("DELETE FROM documents WHERE documentID = ?", [doc.documentID]);
            }
        }

        await db.execute("DELETE FROM documents WHERE documentID = ?", [documentID]);

        res.redirect("/admin");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
};

exports.updateDocument = async (req, res) => {
    const documentID = req.params.documentID;
    const { documentHeader, documentContent, documentWriter, documentIsActive, parentDocumentID, isMainDocument } = req.body;

    try {
        const updatedDocumentIsActive = documentIsActive ? 1 : 0;
        const updatedisMainDocument = isMainDocument ? 1 : 0;

        await db.execute("UPDATE documents SET documentHeader = ?, documentContent = ?, documentWriter = ?, documentIsActive = ?, parentDocumentID = ?, isMainDocument = ? WHERE documentID = ?", [documentHeader, documentContent, documentWriter, updatedDocumentIsActive, parentDocumentID, updatedisMainDocument, documentID]);

        res.redirect("/admin");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
};

exports.addDocument = async (req, res) => {
    const { documentHeader, documentContent, documentWriter, documentIsActive, parentDocumentID, documentsTitle, isMainDocument } = req.body;

    try {
        const isActive = documentIsActive ? 1 : 0;
        const isMainDoc = isMainDocument ? 1 : 0;
        const parentID = parentDocumentID ? parentDocumentID : null;

        await db.execute("INSERT INTO documents (documentHeader, documentContent, documentWriter, documentIsActive, parentDocumentID, documentsTitle, isMainDocument) VALUES (?, ?, ?, ?, ?, ?, ?)", [documentHeader, documentContent, documentWriter, isActive, parentID, documentsTitle, isMainDoc]);
        res.redirect("/admin");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
};

exports.documentDetails = async (req, res) => {
    try {
        const [documents] = await db.execute("SELECT * FROM documents");
        const requestedDoc = documents.find(doc => doc.documentLink == req.params.documentLink);

        if (!requestedDoc) {
            return res.status(404).render("404");
        }

        const [subDocuments] = await db.execute("SELECT * FROM documents WHERE parentDocumentID = ?", [requestedDoc.documentID]);

        if (requestedDoc.documentIsActive === 0) {
            return res.status(404).render("404");
        }

        res.render("document-details", {
            document: requestedDoc,
            subDocuments: subDocuments,
            documents: documents
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
};

exports.indexPage = async (req, res) => {
    try {
        const [documents] = await db.execute("SELECT * FROM documents");

        for (const document of documents) {
            const [subDocuments] = await db.execute("SELECT * FROM documents WHERE parentDocumentID = ?", [document.documentID]);
            document.subDocuments = subDocuments;
        }

        res.render("index", {
            documents: documents
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
};
