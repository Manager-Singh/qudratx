const nodemailer = require("nodemailer");
const fs = require("fs-extra");
const path = require("path");
const handlebars = require("handlebars");

// Register partials once
const partialsPath = path.join(__dirname, "../templates/partials");
fs.readdirSync(partialsPath).forEach(file => {
  const partialName = path.parse(file).name;
  const partialContent = fs.readFileSync(path.join(partialsPath, file), "utf8");
  handlebars.registerPartial(partialName, partialContent);
});

// Compile template with layout
function compileTemplate(templateName, data) {
  const layoutPath = path.join(__dirname, "../templates/layouts/main.hbs");
  const templatePath = path.join(__dirname, `../templates/${templateName}.hbs`);

  const layoutContent = fs.readFileSync(layoutPath, "utf8");
  const templateContent = fs.readFileSync(templatePath, "utf8");

  const template = handlebars.compile(templateContent);
  const bodyHtml = template(data);

  const layoutTemplate = handlebars.compile(layoutContent);
  return layoutTemplate({ ...data, body: bodyHtml });
}

// Send email
async function sendEmail({ to, subject, templateName, templateData }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // from .env
      pass: process.env.EMAIL_PASS
    }
  });

  const html = compileTemplate(templateName, templateData);

  return transporter.sendMail({
    from: `"${templateData.company}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}

module.exports = { sendEmail };
