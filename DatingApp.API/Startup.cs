using System.Net;
using System.Text;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Identity;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

namespace DatingApp.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // order dosent matter
        public void ConfigureServices(IServiceCollection services)
        {
            IdentityBuilder builder = services.AddIdentityCore<User>(opt => {
                opt.Password.RequireDigit = false;
                opt.Password.RequiredLength = 4;
                opt.Password.RequireUppercase = false;
                opt.Password.RequireNonAlphanumeric = false;
            });

            builder = new IdentityBuilder(builder.UserType, typeof(Role), builder.Services);
            builder.AddEntityFrameworkStores<DataContext>();
            builder.AddRoleValidator<RoleValidator<Role>>();
            builder.AddRoleManager<RoleManager<Role>>();
            builder.AddSignInManager<SignInManager<User>>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
               .AddJwtBearer(options =>
               {
                   options.TokenValidationParameters = new TokenValidationParameters()
                   {
                       ValidateIssuerSigningKey = true,
                       IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                           Configuration.GetSection("AppSettings:Token").Value)),
                       ValidateIssuer = false,
                       ValidateAudience = false
                   };
               });

            // policy based authentication
            services.AddAuthorization(option => {
                option.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
                option.AddPolicy("ModeratorPhotoRole", policy => policy.RequireRole("Admin", "Moderator"));
                option.AddPolicy("VipOnly", policy => policy.RequireRole("VIP"));
            });

            services.AddControllers(options => {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                options.Filters.Add(new AuthorizeFilter(policy));
            }).AddNewtonsoftJson(options => {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });
            // ConnectionString is declared in appsettings.json
            services.AddDbContext<DataContext>(x =>
            {
                x.UseLazyLoadingProxies();
                // development connectionstring
                  x.UseSqlServer(Configuration.GetConnectionString("DatingAppDBConnection"));
                // production connection string from azure
               // x.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
            });
            // .AddJsonOptions(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());
            // used to make all properties in camel case in response (id to Id, value to Value)
            //services.AddMvc().AddJsonOptions(
            //    options =>
            //    {
            //        options.SerializerSettings.ContractResolver = new DefaultContractResolver();
            //        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            //    });
            services.AddCors();
            services.Configure<CloudinarySettings>(Configuration.GetSection("CloudinarySettings"));
            services.AddAutoMapper(typeof(DatingRepository).Assembly);
           // services.AddScoped<IAuthRepository, AuthRepository>(); UserManager calss will tc
            services.AddScoped<IDatingRepository, DatingRepository>();
           
            services.AddScoped<LogUserActivity>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        // order matters
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler(handler =>
                {
                    handler.Run(async context =>
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        var error = context.Features.Get<IExceptionHandlerFeature>();
                        if (error != null)
                        {
                            context.Response.AddApplicationError(error.Error.Message);
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
             // app.UseHsts();
            }

            // app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}

// this is the connection string(now we are getting connection string from azure otherwise it should be in appsettings.json)
//"ConnectionStrings": {
//        "DatingAppDBConnection": "server=LAPTOP-SN0B0HHM; database=DatingApp; Trusted_Connection=true;"
//    },
