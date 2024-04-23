using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Linq;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;


namespace Stock_Exchange.Authorization
{
    public class APIKey : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private const string ApiKeyHeaderName = "X-Api-Key";
        private const string ApiKeyValue = "EDIG_Assessment"; // Replace this with your actual API key

        public APIKey(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
        }

        protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!Request.Headers.TryGetValue(ApiKeyHeaderName, out var apiKeyHeaderValues))
            {
                return AuthenticateResult.NoResult();
            }

            var providedApiKey = apiKeyHeaderValues.FirstOrDefault();

            if (!ApiKeyValue.Equals(providedApiKey))
            {
                return AuthenticateResult.Fail("Invalid API Key provided.");
            }

            var claims = new Claim[] { new Claim(ClaimTypes.Name, ApiKeyHeaderName) };
            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);
        }
    }

}
