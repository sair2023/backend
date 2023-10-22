'use strict';

var Empleado = require('../models/empleado');
var Tienda = require('../models/tienda');
var Ventas = require('../models/venta');
var PDFDocument = require('pdfkit');
var fs = require('fs');

function calcularIGSS(salarioTotal) {
    // Lógica para calcular el IGSS
    // Retorna el monto calculado del IGSS.
    const porcentajeIGSS = 0.0483; // Ejemplo: 4.83%
    return salarioTotal * porcentajeIGSS;
}

async function generarNominaPDF(empleados) {
    const doc = new PDFDocument();
    // doc.pipe(fs.createWriteStream('nomina_mensual.pdf'));

    for (const empleado of empleados) {
        const compras = await Tienda.aggregate([
            { $match: { empleadoId: empleado._id } },
            { $group: { _id: null, totalCompras: { $sum: "$total" } } }
        ]);
        // Obtener el total de ventas del empleado desde el modelo Ventas
        const ventas = await Ventas.aggregate([
            { $match: { empleadoId: empleado._id } },
            { $group: { _id: null, totalVentas: { $sum: "$total" } } }
        ]);
        const totalVentas = ventas.length > 0 ? ventas[0].totalVentas : 0;

         // Calcular la bonificación basada en el total de ventas
         let bonificacion = 0;
         if (totalVentas > 400000) {
             bonificacion = totalVentas * 0.045;
         } else if (totalVentas > 200000) {
             bonificacion = totalVentas * 0.035;
         } else if (totalVentas > 100000) {
             bonificacion = totalVentas * 0.025;
         }

        const totalCompras = compras.length > 0 ? compras[0].totalCompras : 0;
        const salarioTotal = empleado.salario_base + bonificacion - totalCompras;
        const mesesTrabajados = calcularMesesTrabajados(empleado.fecha_contra);
        const igss = calcularIGSS(empleado.salario_base);

        // Agregar datos del empleado y prestaciones al PDF con estilo mejorado
        doc
            .font('Times-Roman')
            .fontSize(14)
            .fillColor('#333333')
            .text('RECIBO', { align: 'center' })
            .text('\n')
            .text('------------------------------------------------------------------------------------', { align: 'center' })
            .text(`Nombre Completo: ${empleado.nombre} ${empleado.apellido}`)
            .text(`Salario Base: Q ${empleado.salario_base}`)
            .text(`Gastos en Tienda: Q ${totalCompras}`)
            .text(`Deuda: Q ${salarioTotal}`)
            .text(`Bonificacion por ventas: Q ${bonificacion}`)
            .text(`Meses Trabajados: ${mesesTrabajados}`)
            .text(`Salario Total: ${salarioTotal}`)
            .text(`IGSS: Q ${igss}`)
            .text('\n\n')
            .fillColor('#333333')
            .text('Firma Empleado: _______________', { align: 'right' , continued: true } )
            .text('')
            .text('Firma Gerente:  _______________', { align: 'left' })
            .text('')
            .text('\n')
            .text('------------------------------------------------------------------------------------', { align: 'center' })
            .text('\n\n');
    }

    // Finaliza el PDF
    doc.end();
    return doc;
}

function calcularMesesTrabajados(fechaContrato) {
    // Lógica para calcular los meses trabajados desde la fecha de contrato hasta ahora.
    // Retorna el número de meses trabajados.
    const fechaContratoObj = new Date(fechaContrato);
    const fechaActual = new Date();
    const mesesTrabajados = (fechaActual.getFullYear() - fechaContratoObj.getFullYear()) * 12 + (fechaActual.getMonth() - fechaContratoObj.getMonth());
    return mesesTrabajados;
}

async function generarNominaMensual(req, res) {
    try {
        const empleados = await Empleado.find({});
        const pdfStream = await generarNominaPDF(empleados);

        pdfStream.on('error', (error) => {
            console.error(error);
            res.status(500).send({ error: 'Error al generar la nómina mensual.' });
        });

        pdfStream.on('finish', () => {
            console.log('PDF generado con éxito.');
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=nomina_mensual.pdf');
        pdfStream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al generar la nómina mensual.' });
    }
}


module.exports = {
    generarNominaMensual: generarNominaMensual
};
