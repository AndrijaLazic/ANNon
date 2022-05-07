using Projekat.Modeli;
namespace Projekat.Servisi
{
    public interface IMailService
    {
        Task<bool> SendAsync(MailData mailData, CancellationToken ct);
    }
}
