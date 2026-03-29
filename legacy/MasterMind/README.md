# MasterMind — Juego Mastermind con IA (VB.NET)

Implementación del clásico juego de deducción Mastermind en Visual Basic .NET, con componente de inteligencia artificial.

## ¿De qué trata?

Mastermind es un juego donde un jugador debe adivinar una combinación secreta de colores/números. Este proyecto implementa el juego en Windows Forms e incluye una base de conocimiento (`kbase.mdb`, `kbase.xls`, `kbaseJugadas.xls`) que sugiere un componente de IA que aprende o registra las jugadas. Ver también el proyecto hermano **mente maestra** que contiene la clase VB principal.

## Tecnologías

- VB.NET (Windows Forms, Visual Studio)
- Base de datos Access (`.mdb`) y Excel (`.xls`) como almacenamiento de la KB de IA

## Estado

⚠️ **Parcialmente completo.** Existe un ejecutable compilado y una base de conocimiento, lo que indica que el proyecto llegó a un estado funcional en algún momento. Sin embargo, los archivos fuente `.vb` no están en la carpeta del proyecto (están en el proyecto hermano `mente maestra`).

## Potencial

⭐⭐⭐ **Medio.** El enfoque de usar una base de conocimiento para mejorar las jugadas del agente es interesante. En su momento fue un proyecto ambicioso. Hoy podría rescatarse modernizando la IA con un algoritmo minimax o incluso ML, pero la tecnología base (VB.NET + Access) está muy desactualizada.
