using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace CasaticDirectorio.Api.Services;

public class EmailSettings
{
    public bool Enabled { get; set; } = false;
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; } = 587;
    public bool UseSsl { get; set; } = true;
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FromAddress { get; set; } = "no-reply@casatic.org";
    public string FromName { get; set; } = "CASATIC Directorio";

    public bool IsConfigured => Enabled &&
        !string.IsNullOrWhiteSpace(Host) &&
        !string.IsNullOrWhiteSpace(FromAddress);
}

public interface IEmailService
{
    bool IsEnabled { get; }
    Task SendEmailAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default);
}

public class SmtpEmailService : IEmailService
{
    private readonly EmailSettings _settings;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IOptions<EmailSettings> options, ILogger<SmtpEmailService> logger)
    {
        _settings = options.Value;
        _logger = logger;
    }

    public bool IsEnabled => _settings.IsConfigured;

    public async Task SendEmailAsync(string to, string subject, string htmlBody, CancellationToken cancellationToken = default)
    {
        if (!_settings.IsConfigured)
        {
            _logger.LogWarning("Email service is not configured. Email not sent to {Email}.", to);
            return;
        }

        using var message = new MailMessage();
        message.From = new MailAddress(_settings.FromAddress, _settings.FromName);
        message.To.Add(to);
        message.Subject = subject;
        message.Body = htmlBody;
        message.IsBodyHtml = true;

        using var smtp = new SmtpClient(_settings.Host, _settings.Port)
        {
            EnableSsl = _settings.UseSsl,
            Timeout = 100000
        };

        if (!string.IsNullOrWhiteSpace(_settings.Username))
        {
            smtp.Credentials = new NetworkCredential(_settings.Username, _settings.Password);
        }

        await smtp.SendMailAsync(message, cancellationToken);
        _logger.LogInformation("Email enviado a {Email} usando SMTP {Host}:{Port}", to, _settings.Host, _settings.Port);
    }
}
