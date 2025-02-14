import { factories } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';

export default factories.createCoreService(
  'api::appointment.appointment',
  ({ strapi }) => ({
    async sendPendingEmails() {
      try {
        // Load HTML template
        const templatePath = path.join(
          process.cwd(),
          'src',
          'email-templates',
          'appointment-notification.html'
        );
        const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

        const appointments = await strapi.entityService.findMany(
          'api::appointment.appointment',
          {
            filters: { emailSent: false },
          }
        );

        for (const appointment of appointments) {
          // Replace template variables
          const htmlContent = htmlTemplate
            .replace(/{{nombre}}/g, appointment.name)
            .replace(/{{email}}/g, appointment.email)
            .replace(/{{telefono}}/g, appointment.phone)
            .replace(/{{motivo}}/g, appointment.reason || 'No especificado');

          await strapi.plugins['email'].services.email.send({
            to: process.env.OWNER_EMAIL,
            from: process.env.MAIL_FROM,
            subject: '📅 Nueva consulta agendada',
            html: htmlContent,
          });

          await strapi.entityService.update(
            'api::appointment.appointment',
            appointment.id,
            { data: { emailSent: true } }
          );
        }

        return { count: appointments.length };
      } catch (error) {
        strapi.log.error('Error enviando correos:', error);
        throw error;
      }
    },
  })
);