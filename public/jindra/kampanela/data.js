/* ---------------------------------------------------------------
   Keramika Kampanela — obsah a nastavení webu
   Naposledy uloženo z editoru: 31.08.2026 17:06
----------------------------------------------------------------*/

const DEFAULT_DATA = {
  "meta": {
    "brand": "Keramika Kampanela",
    "tagline": "",
    "domain": "kampanela.cz",
    "favicon": "🏺",
    "logo": {
      "show": true,
      "size": 32,
      "color": "accent",
      "opacity": 1,
      "type": "image",
      "src": "images/kampanela-logo-square.svg",
      "lineWidth": 4.5
    }
  },
  "theme": {
    "fontDisplay": "Cormorant Garamond",
    "fontBody": "Inter",
    "baseSize": 17,
    "scale": 1.3,
    "letterDisplay": 0.01,
    "letterNav": 0.2,
    "radius": 0,
    "maxWidth": 1520,
    "colorBg": "#fbfaf8",
    "colorSurface": "#f1efeb",
    "colorInk": "#1b1a18",
    "colorMuted": "#7c766f",
    "colorAccent": "#458AC1",
    "colorLine": "#e6e2dc",
    "imgRadius": 0,
    "sectionSpace": 112,
    "colorBrand": "#458AC1",
    "blueMode": "off",
    "secondaryText": "brand",
    "preset": "galerie",
    "headerMode": "over",
    "mode": "light",
    "allowToggle": true,
    "palettes": {
      "light": {
        "bg": "#fbfaf8",
        "surface": "#f1efeb",
        "ink": "#1b1a18",
        "muted": "#7c766f",
        "accent": "#458AC1",
        "line": "#e6e2dc"
      },
      "dark": {
        "bg": "#111112",
        "surface": "#1a1a1c",
        "ink": "#f4f2ee",
        "muted": "#a09c96",
        "accent": "#6aa9d8",
        "line": "#27272a"
      }
    },
    "defaultMode": "light"
  },
  "nav": {
    "style": "plain",
    "align": "center",
    "sticky": true,
    "size": 11.5,
    "items": [
      {
        "label": "Úvod",
        "target": "uvod"
      },
      {
        "label": "Kolekce",
        "target": "kolekce"
      },
      {
        "label": "O dílně",
        "target": "o-dilne"
      },
      {
        "label": "Galerie",
        "target": "galerie"
      },
      {
        "label": "Kontakt",
        "target": "kontakt"
      }
    ]
  },
  "hero": {
    "eyebrow": "Ručně točená keramika z české dílny",
    "title": "Keramika našich babiček",
    "text": "Vítejte na stránkách Rodinné dílny Renaty a Jaroslava.",
    "ctaPrimary": {
      "label": "Prohlédnout kolekci",
      "target": "kolekce"
    },
    "ctaSecondary": {
      "label": "NAPSAT NÁM",
      "target": "kontakt"
    },
    "layout": "overlay",
    "height": 100,
    "align": "center",
    "image": {
      "src": "images/hero-dilna.jpg",
      "alt": "Točení na hrnčířském kruhu",
      "opacity": 1,
      "brightness": 1,
      "contrast": 1,
      "saturate": 0.96,
      "blur": 0,
      "grayscale": 0,
      "fit": "cover",
      "posX": 33,
      "posY": 57,
      "radius": 0,
      "ratio": "3 / 2",
      "scale": 1.62,
      "srcs": [],
      "pick": "single",
      "rotate": 0,
      "flip": false
    },
    "overlay": 0.42,
    "textColorOnImage": "#ffffff",
    "media": "image",
    "video": {
      "src": "",
      "poster": "images/hero-dilna.jpg",
      "opacity": 1,
      "brightness": 1,
      "saturate": 0.9,
      "blur": 0,
      "muted": true,
      "loop": true
    },
    "random": false,
    "pool": []
  },
  "intro": {
    "show": true,
    "eyebrow": "Dílna",
    "title": "Jeden dekor, celá kuchyň",
    "text": "Naši keramiku spojuje jasný rukopis a jemný dekor — praktičnost snoubená s krásou. Vše spolu krásně hraje a věříme, že vám naše sety z keramiky zútulní vaši domácnost — a že i jedna káva z našeho šálku vám hezky nastartuje den. Ať už máte zájem o hrneček, nebo kompletní vybavení, neváhejte se na nás obrátit. :-)"
  },
  "categories": {
    "eyebrow": "KOLEKCE",
    "title": "Kategorie",
    "text": "Ukázka z naší tvorby",
    "columns": 3,
    "ratio": "1 / 1",
    "captionPos": "over",
    "items": [
      {
        "id": "maslenky",
        "name": "Máslenky",
        "desc": "Francouzské i klasické, s dřevěným podnosem.",
        "image": {
          "src": "images/maslenka-zahrada.jpg",
          "alt": "Francouzská máslenka",
          "opacity": 1,
          "brightness": 1,
          "contrast": 1,
          "saturate": 1,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 50,
          "posY": 50,
          "radius": 0,
          "scale": 1,
          "pick": "single",
          "srcs": [],
          "rotate": 0,
          "flip": false
        }
      },
      {
        "id": "dozy",
        "name": "Dózy",
        "desc": "Cukr, sůl, strouhanka i citron — s dubovým víkem.",
        "image": {
          "src": "images/dozy-cukr-sul.jpg",
          "alt": "Dózy na cukr a sůl",
          "opacity": 1,
          "brightness": 1,
          "contrast": 1,
          "saturate": 1,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 50,
          "posY": 40,
          "radius": 0,
          "scale": 1,
          "srcs": [],
          "pick": "single",
          "rotate": 0,
          "flip": false
        }
      },
      {
        "id": "hrnky",
        "name": "Hrnky a šálky",
        "desc": "Do ruky i na stůl, s malovaným lemem.",
        "image": {
          "src": "images/hrnek-louka.jpg",
          "alt": "Hrnek s malovaným lemem",
          "opacity": 1,
          "brightness": 1,
          "contrast": 1,
          "saturate": 1,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 42,
          "posY": 50,
          "radius": 0,
          "scale": 1,
          "srcs": [],
          "pick": "single",
          "rotate": 0,
          "flip": false
        }
      },
      {
        "id": "vazy",
        "name": "Vázy",
        "desc": "Na jednu větev i na plnou náruč.",
        "image": {
          "src": "images/vaza-narcisy.jpg",
          "alt": "Váza s narcisy",
          "opacity": 1,
          "brightness": 1,
          "contrast": 1,
          "saturate": 1,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 50,
          "posY": 50,
          "radius": 0,
          "scale": 1,
          "srcs": [],
          "pick": "single",
          "rotate": 0,
          "flip": false
        }
      },
      {
        "id": "servirovani",
        "name": "Servírování",
        "desc": "Mísy, cedníky, podnosy a poklopy.",
        "image": {
          "src": "images/cednik.jpg",
          "alt": "Cedník s jahodami",
          "opacity": 1,
          "brightness": 1,
          "contrast": 1,
          "saturate": 1,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 50,
          "posY": 50,
          "radius": 0,
          "scale": 1,
          "srcs": [],
          "pick": "single",
          "rotate": 0,
          "flip": false
        }
      },
      {
        "id": "sady",
        "name": "Sady a soubory",
        "desc": "Sladěné celky pro celou kuchyň.",
        "image": {
          "src": "images/skanzen-sada.jpg",
          "alt": "Sada nádobí",
          "opacity": 1,
          "brightness": 1,
          "contrast": 1,
          "saturate": 1,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 50,
          "posY": 45,
          "radius": 0,
          "scale": 1,
          "srcs": [],
          "pick": "single",
          "rotate": 0,
          "flip": false
        }
      }
    ]
  },
  "feature": {
    "show": true,
    "eyebrow": "Vybíráme",
    "reverse": false,
    "active": 0,
    "items": [
      {
        "title": "Snídaňový / kávový keramický set",
        "text": "Šálek s podšálkem a servírovací tác v jednom dekoru. Espresso, kus chleba, hrozny — a stůl je prostřený, aniž byste cokoli sháněli dohromady.",
        "bullets": [],
        "stepsTitle": "Co set obsahuje",
        "steps": [
          {
            "title": "Šálek s podšálkem",
            "text": "Objem na espresso i na malé cappuccino, ražený kytičkový lem po obvodu a na podšálku."
          },
          {
            "title": "Servírovací tác",
            "text": "Úzký podlouhlý tác na pečivo, ovoce nebo sýry — sladěný se šálkem."
          },
          {
            "title": "Doplníme na míru",
            "text": "Set rozšíříme o další šálky, misku nebo máslenku, ať máte celý stůl v jednom dekoru."
          }
        ],
        "stepsNote": "Kamenina pálená na vysokou teplotu — vydrží každodenní používání i myčku.",
        "ctaLabel": "SADY V KOLEKCI",
        "ctaTarget": "kolekce",
        "image": {
          "src": "images/snidanovy-set.jpg",
          "alt": "Snídaňový a kávový keramický set",
          "opacity": 1,
          "brightness": 1,
          "contrast": 1,
          "saturate": 1,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 50,
          "posY": 60,
          "radius": 0,
          "ratio": "4 / 5",
          "scale": 1,
          "srcs": [],
          "pick": "single",
          "rotate": 0,
          "flip": false
        }
      },
      {
        "title": "Francouzská máslenka",
        "text": "Máslo se ukládá do víčka, spodní díl se naplní vodou. Vzduch se k máslu nedostane a zůstává měkké i mimo lednici — několik dní.",
        "bullets": [],
        "stepsTitle": "Jak o máslenku pečovat?",
        "steps": [
          {
            "title": "Máslo",
            "text": "Do horního kalíšku (víčka) pevně vtlačte změklé máslo. Dbejte na to, aby uvnitř nezůstaly vzduchové bubliny."
          },
          {
            "title": "Voda",
            "text": "Do spodní nádoby nalijte cca 1–2 cm studené vody. Po přiklopení víčkem musí voda vytvořit přirozený uzávěr, který chrání máslo před vzduchem."
          },
          {
            "title": "Čerstvost",
            "text": "Pro zachování nejlepší kvality a chuti doporučujeme vodu každé 2–3 dny vyměnit."
          }
        ],
        "stepsNote": "Díky tomuto rituálu bude Vaše máslo vždy krémové a připravené k okamžitému mazání.",
        "ctaLabel": "Máslenky v kolekci",
        "ctaTarget": "kolekce",
        "image": {
          "src": "images/maslenka-chleb.jpg",
          "alt": "Máslenka na stole",
          "opacity": 1,
          "brightness": 1,
          "contrast": 1,
          "saturate": 1,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 50,
          "posY": 45,
          "radius": 0,
          "ratio": "4 / 5",
          "scale": 1,
          "srcs": [],
          "pick": "single",
          "rotate": 0,
          "flip": false
        }
      },
      {
        "title": "Keramické servírovací prkénko s úchyty",
        "text": "Podlouhlý tác s uchy na obou koncích — snese se s ním celá snídaně najednou. Ručně tvarovaný, po obvodu s ražbou drobných kytiček, bílá glazura.",
        "bullets": [],
        "stepsTitle": "K čemu se hodí",
        "steps": [
          {
            "title": "Snídaně a káva",
            "text": "Šálek, pečivo, máslo i marmeláda se na něj vejdou vedle sebe — a donesete je na jeden zátah."
          },
          {
            "title": "Sýry a tapas",
            "text": "Úzký tvar sedne na střed stolu; podává se z něj bez přendávání."
          },
          {
            "title": "Úchyty",
            "text": "Ucha jsou vytažená z jednoho kusu hlíny, takže nikde nic nedrží na spoji a nemá se co uvolnit."
          }
        ],
        "stepsNote": "Do myčky i do trouby. Každý kus je tvarovaný v ruce, drobné odchylky rozměru patří k věci.",
        "ctaLabel": "Servírování v kolekci",
        "ctaTarget": "kolekce",
        "image": {
          "src": "images/prkenko-s-uchyty.jpg",
          "alt": "Keramické servírovací prkénko s úchyty",
          "opacity": 1,
          "brightness": 1.11,
          "contrast": 1.12,
          "saturate": 1.13,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 50,
          "posY": 55,
          "radius": 0,
          "ratio": "4 / 5",
          "scale": 1,
          "srcs": [],
          "pick": "single",
          "rotate": 0,
          "flip": false
        }
      },
      {
        "title": "Keramické struhadlo",
        "text": "Malé struhadlo na česnek",
        "bullets": [],
        "stepsTitle": "",
        "steps": [],
        "stepsNote": "",
        "ctaLabel": "",
        "ctaTarget": "kolekce",
        "image": {
          "src": "images/keramicke--struhadlo-kampanela.jpg",
          "alt": "Keramické struhadlo s otvorem na zavěšení",
          "opacity": 1,
          "brightness": 1,
          "contrast": 1,
          "saturate": 1,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 50,
          "posY": 50,
          "radius": 0,
          "ratio": "4 / 5",
          "scale": 1,
          "srcs": [],
          "pick": "single",
          "rotate": 0,
          "flip": false
        }
      }
    ]
  },
  "about": {
    "eyebrow": "O dílně",
    "title": "Rodinná dílna od roku 2000",
    "text": "Keramiku Kampanelu založili v roce 2000 manželé Renata a Jaroslav. Renata se keramice věnuje od dětství — umělecko‑řemeslné zpracování keramiky vystudovala v Luhačovicích. Jaroslav studoval zpracování dřeva v Bystřici pod Hostýnem a k hlíně se dostal už během studia.\n\nVšechno vyrábíme výhradně ručně z přírodních materiálů. Najdete nás na hrnčířských trzích a v skanzenech, kde nádobí vystavujeme a prodáváme. Rádi vyrobíme i sadu na míru.",
    "stats": [
      {
        "value": "2000",
        "label": "rok založení dílny"
      },
      {
        "value": "100 %",
        "label": "ruční práce"
      },
      {
        "value": "Napište nám",
        "label": "ZAKÁZKOVÁ VÝROBA"
      }
    ],
    "marketsTitle": "Kde nás potkáte",
    "markets": [
      "Hrnčířské trhy Beroun",
      "Veselý Kopec",
      "Kostelec nad Černými lesy",
      "Slavnosti česneku Buchlovice",
      "Chodské slavnosti Domažlice"
    ],
    "image": {
      "src": "images/689433726_1687990442754774_8953167916532658658_n.jpg",
      "alt": "Keramika v zahradě",
      "opacity": 1,
      "brightness": 1,
      "contrast": 1,
      "saturate": 1,
      "blur": 0,
      "grayscale": 0,
      "fit": "cover",
      "posX": 50,
      "posY": 50,
      "radius": 0,
      "ratio": "1 / 1",
      "scale": 1,
      "srcs": [],
      "pick": "single",
      "rotate": 0,
      "flip": false
    }
  },
  "gallery": {
    "eyebrow": "Galerie",
    "title": "Naše výrobky",
    "text": "",
    "layout": "grid",
    "columns": 4,
    "gap": 4,
    "items": [
      {
        "image": {
          "src": "images/doza-citron.jpg",
          "alt": "Dóza na citron",
          "opacity": 1,
          "brightness": 1,
          "contrast": 1,
          "saturate": 1,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 50,
          "posY": 50,
          "radius": 0,
          "scale": 1,
          "srcs": [],
          "pick": "single",
          "rotate": 0,
          "flip": false
        },
        "caption": "Dóza na citron",
        "span": 2
      },
      {
        "image": {
          "src": "images/sada-poklop.jpg",
          "alt": "Poklopy a mísy",
          "opacity": 1,
          "brightness": 1,
          "contrast": 1,
          "saturate": 1,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 50,
          "posY": 50,
          "radius": 0,
          "scale": 1,
          "srcs": [],
          "pick": "single",
          "rotate": 0,
          "flip": false
        },
        "caption": "Poklopy a mísy",
        "span": 1
      },
      {
        "image": {
          "src": "images/vaza-narcisy.jpg",
          "alt": "Váza",
          "opacity": 1,
          "brightness": 1,
          "contrast": 1,
          "saturate": 1,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 50,
          "posY": 50,
          "radius": 0,
          "scale": 1,
          "srcs": [],
          "pick": "single",
          "rotate": 0,
          "flip": false
        },
        "caption": "Váza",
        "span": 1
      },
      {
        "image": {
          "src": "images/skanzen-sada.jpg",
          "alt": "Sada",
          "opacity": 1,
          "brightness": 1,
          "contrast": 1,
          "saturate": 1,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 50,
          "posY": 45,
          "radius": 0,
          "scale": 1,
          "srcs": [],
          "pick": "single",
          "rotate": 0,
          "flip": false
        },
        "caption": "Na jarmarku",
        "span": 2
      },
      {
        "image": {
          "src": "images/cednik.jpg",
          "alt": "Cedník",
          "opacity": 1,
          "brightness": 1,
          "contrast": 1,
          "saturate": 1,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 50,
          "posY": 50,
          "radius": 0,
          "scale": 1,
          "srcs": [],
          "pick": "single",
          "rotate": 0,
          "flip": false
        },
        "caption": "Cedník",
        "span": 1
      },
      {
        "image": {
          "src": "images/maslenka-zahrada.jpg",
          "alt": "Máslenka",
          "opacity": 1,
          "brightness": 1,
          "contrast": 1,
          "saturate": 1,
          "blur": 0,
          "grayscale": 0,
          "fit": "cover",
          "posX": 50,
          "posY": 50,
          "radius": 0,
          "scale": 1,
          "srcs": [],
          "pick": "single",
          "rotate": 0,
          "flip": false
        },
        "caption": "Máslenka",
        "span": 2
      }
    ]
  },
  "contact": {
    "eyebrow": "Kontakt",
    "title": "Napište nám",
    "text": "Zakázky, sady na míru i dotazy k dostupnosti — ozveme se zpět",
    "rows": [
      {
        "label": "E-MAIL",
        "value": "keramika.kampanela@seznam.cz",
        "href": "mailto:keramika.kampanela@seznam.cz"
      },
      {
        "label": "TELEFON",
        "value": "+ 420 777 660 442",
        "href": "tel:+420777660442"
      },
      {
        "label": "WhatsApp",
        "value": "+420 777 660 442",
        "href": "https://wa.me/420777660442"
      },
      {
        "label": "KDE NÁS NAJDETE",
        "value": "Na hrnčířských trzích a jarmarcích",
        "href": ""
      }
    ],
    "pullUp": 160
  },
  "social": {
    "display": "icon",
    "iconStyle": "line",
    "size": 19,
    "gap": 14,
    "strokeWidth": 1.5,
    "showInHeader": true,
    "showInFooter": true,
    "items": [
      {
        "type": "instagram",
        "label": "Instagram",
        "url": "https://instagram.com/kampanelacz/"
      },
      {
        "type": "facebook",
        "label": "Facebook",
        "url": "https://facebook.com/keramikakampanela"
      },
      {
        "type": "whatsapp",
        "label": "WhatsApp",
        "url": "https://wa.me/420777660442"
      },
      {
        "type": "email",
        "label": "E-mail",
        "url": "mailto:keramika.kampanela@seznam.cz"
      }
    ],
    "glyph": "line",
    "shape": "none",
    "shapePad": 7
  },
  "footer": {
    "note": "\n",
    "copyright": "© 2026",
    "credit": "Design & Development: Ing. Jindřich Traxmandl",
    "bg": {
      "show": true,
      "image": {
        "src": "images/za-pati--2.jpg",
        "alt": "Talíř s razítkem Kampanela na hrnčířském kruhu",
        "opacity": 1,
        "brightness": 1,
        "contrast": 1.19,
        "saturate": 0.84,
        "blur": 0,
        "grayscale": 0,
        "fit": "cover",
        "posX": 53,
        "posY": 40,
        "radius": 0,
        "scale": 1,
        "srcs": [],
        "pick": "single",
        "rotate": -10,
        "flip": false
      },
      "height": 580,
      "fadeMid": 25,
      "transTop": 100,
      "transBottom": 54
    }
  },
  "motif": {
    "show": true,
    "places": [],
    "count": 5,
    "size": 22,
    "gap": 46,
    "petal": "#2f4f8f",
    "center": "#e3bf3f",
    "opacity": 0.85,
    "animate": true,
    "speed": 90,
    "offset": -94,
    "offsetX": 51
  },
  "trail": {
    "enabled": true,
    "maxOpacity": 0.65,
    "fadeSpeed": 0.006,
    "spawnDistance": 50,
    "maxParticles": 10,
    "size": 12,
    "driftSpeed": 0.12,
    "rotationSpeed": 0.008,
    "glitter": false,
    "glitterOpacity": 0.25,
    "blue": "#556994",
    "yellow": "#d9b668"
  },
  "spacing": {
    "intro": {
      "top": 69,
      "bottom": 69
    },
    "kolekce": {
      "top": 112,
      "bottom": 112
    },
    "vybirame": {
      "top": 69,
      "bottom": 69
    },
    "oDilne": {
      "top": 112,
      "bottom": 112
    },
    "galerie": {
      "top": 112,
      "bottom": 112
    },
    "kontakt": {
      "top": 112,
      "bottom": 112
    }
  }
};
