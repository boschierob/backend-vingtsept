// saveInter.js
const express = require('express');
const router = express.Router();
const MonthlySheet = require('../models/monthlySheetSchema');
//const Worker = require('../models/Worker');

// Fonction pour créer une nouvelle feuille mensuelle
const createMonthlySheet = (req, res) => {
     console.log(`data from front : ${req.body}`);
    res.send(req.body)
    /* try {
      const newMonthlySheet = new MonthlySheet(req.body);
      const savedMonthlySheet = await newMonthlySheet.save();
  
      // Ajouter l'ID de la nouvelle feuille mensuelle à la liste des monthlySheets du Worker
      const workerId = req.body.related_worker;
      await Worker.findByIdAndUpdate(workerId, {
        $push: { monthlySheets: savedMonthlySheet._id }
      });
  
      res.status(201).json(savedMonthlySheet);
    } catch (error) {
      res.status(400).json({ error: error.message });
    } */
  };

 // Fonction pour mettre à jour une feuille mensuelle
const updateMonthlySheet = async (req, res) => {
    try {
      const monthlySheetId = req.params.id;
      const updatedMonthlySheetData = req.body;
  
      // Mettre à jour la feuille mensuelle
      const updatedMonthlySheet = await MonthlySheet.findByIdAndUpdate(
        monthlySheetId,
        updatedMonthlySheetData,
        { new: true }
      );
  
      res.json(updatedMonthlySheet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Fonction pour supprimer une feuille mensuelle
const deleteMonthlySheet = async (req, res) => {
    try {
      const monthlySheetId = req.params.id;
  
      // Trouver le travailleur associé à la feuille mensuelle à supprimer
      const worker = await Worker.findOne({ monthlySheets: monthlySheetId });
  
      if (!worker) {
        return res.status(404).json({ message: 'Travailleur non trouvé' });
      }
  
      // Supprimer la feuille mensuelle du travailleur
      worker.monthlySheets.pull(monthlySheetId);
      await worker.save();
  
      // Supprimer la feuille mensuelle
      await MonthlySheet.findByIdAndDelete(monthlySheetId);
  
      res.json({ message: 'Feuille mensuelle supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


// Route pour obtenir toutes les feuilles mensuelles
router.get('/', async (req, res) => {
  try {
    const monthlySheets = await MonthlySheet.find();
    res.json(monthlySheets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour obtenir une feuille mensuelle par ID
router.get('/:id', async (req, res) => {
  try {
    const monthlySheet = await MonthlySheet.findById(req.params.id);
    res.json(monthlySheet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour créer une nouvelle feuille mensuelle
router.post('/', createMonthlySheet);

// Route pour mettre à jour une feuille mensuelle
router.put('/:id',updateMonthlySheet);

// Route pour supprimer une feuille mensuelle
router.delete('/:id', deleteMonthlySheet);

module.exports = router;
