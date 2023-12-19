import { Component, OnInit } from '@angular/core';
import { Produit } from '../model/produit';
import { NgForm } from '@angular/forms';
import { ProduitsService } from '../services/produits.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  produits: Array<Produit> = [];
  produitCourant = new Produit();
  editMode: boolean = false; // Définissez-le selon vos besoins

  constructor(private produitsService: ProduitsService) {}

  ngOnInit(): void {
    console.log("Initialisation du composant...");
    this.consulterProduits();
  }

  consulterProduits() {
    console.log("Récupérer la liste des produits...");
    this.produitsService.getProduits().subscribe({
      next: data => {
        console.log("Succès GET");
        this.produits = data;
      },
      error: err => {
        console.error("Erreur GET", err);
      }
    });
  }

  mettreAJourProduit(nouveau: Produit, ancien: Produit) {
    this.produitsService.updateProduit(nouveau.id, nouveau).subscribe({
      next: updatedProduit => {
        console.log("Succès PUT");
        Object.assign(ancien, nouveau);
        console.log('Mise à jour du produit : ' + ancien.designation);
      },
      error: err => {
        console.error("Erreur PUT:", err);
      }
    });
  }

  ajouterProduit(nouveau: Produit) {
    this.produitsService.addProduit(nouveau).subscribe({
      next: addedProduit => {
        console.log("Succès POST");
        this.produits.push(nouveau);
        console.log("Ajout d'un nouveau produit : " + nouveau.designation);
      },
      error: err => {
        console.error("Erreur POST:", err);
      }
    });
  }

  supprimerProduit(produit: Produit) {
    const confirmation = confirm("Voulez-vous supprimer le produit : " + produit.designation + " ?");
    if (confirmation) {
      console.log("Suppression confirmée...");

      this.produitsService.deleteProduit(produit.id).subscribe({
        next: deletedProduit => {
          console.log("Succès DELETE");
          const index: number = this.produits.indexOf(produit);
          if (index !== -1) {
            this.produits.splice(index, 1);
          }
        },
        error: err => {
          console.error("Erreur DELETE:", err);
        }
      });
    } else {
      console.log("Suppression annulée...");
    }
  }
  validerFormulaire(produitForm: any) {
    if (produitForm.value.id !== undefined) {
      console.log("ID non vide...");
      const existingProduct = this.produits.find(p => p.id === produitForm.value.id);

      if (existingProduct) {
        const confirmation = confirm("Produit existant. Confirmez-vous la mise à jour de : " + existingProduct.designation + "?");

        if (confirmation) {
          this.mettreAJourProduit(produitForm.value, existingProduct);
        } else {
          console.log("Mise à jour annulée");
        }
        return;
      }
    }

    this.ajouterProduit(produitForm.value);
  }

  effacerSaisie(produitForm: NgForm) {
    this.produitCourant = new Produit();
    produitForm.resetForm();
  }

  editerProduit(produit: any) {
    this.produitCourant = produit;
    this.editMode = true;
  }

  annulerEdition() {
    this.editMode = false; // Désactive le mode édition
    this.produitCourant = new Produit(); // Réinitialise le produit courant
  }
   
}
