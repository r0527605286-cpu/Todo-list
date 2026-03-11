using Microsoft.EntityFrameworkCore;
using TodoApi;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;

//הגדרת הבנאי
var builder = WebApplication.CreateBuilder(args);

// ---  רישום שירותים ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ToDoDbContext>();

// --- הוספת שירותי אימות JWT ---
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            //הגדרות הטוקן
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

//הגבלת גישה
builder.Services.AddAuthorization();

// הגדרת CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// ---  בניית האפליקציה ---
var app = builder.Build();

//הגדרת -Middleware
//cors
app.UseCors("AllowAll");
// הפעלת אימות והרשאות של הטוקן
app.UseAuthentication();
app.UseAuthorization();

//swgger-הפעלת ה
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ---  ניתובים (Routes) ---

app.MapGet("/", () => "Hello World!");

// --- ניתובי משתמשים (Auth) ---

app.MapPost("/register", async (ToDoDbContext db, User user) => {
    var exists = await db.Users.AnyAsync(u => u.Username == user.Username);
    if (exists) return Results.BadRequest("Username already exists");

    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Ok("User created successfully");
});

app.MapPost("/login", async (ToDoDbContext db, IConfiguration config, User loginUser) => {
    var user = await db.Users.FirstOrDefaultAsync(u => 
        u.Username == loginUser.Username && u.Password == loginUser.Password);

    if (user == null) return Results.Unauthorized();

    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

    var claims = new[] {
        new Claim(ClaimTypes.Name, user.Username),
        new Claim("Id", user.Id.ToString())
    };

    var token = new JwtSecurityToken(
        issuer: config["Jwt:Issuer"],
        audience: config["Jwt:Audience"],
        claims: claims,
        expires: DateTime.Now.AddMinutes(120),
        signingCredentials: credentials);

    var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

    return Results.Ok(new { token = tokenString });
});

// --- ניתובי משימות (Items) - כולם דורשים Authorization ---
//כלומר רק משתמש עם טוקן בתוקף יכול להפעיל אותם.

//שליפת כל המשימות
app.MapGet("/items", async (ToDoDbContext db) => 
    await db.Items.ToListAsync()).RequireAuthorization();

//יצירת משימה חדשה
app.MapPost("/items", async (ToDoDbContext db, Item item) =>
{
    db.Items.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/items/{item.Id}", item);
}).RequireAuthorization();

//עדכון משימה
app.MapPut("/items/{id}", async (ToDoDbContext db, int id, bool isComplete) =>
{
    var item = await db.Items.FindAsync(id);
    if (item is null) return Results.NotFound();

    item.IsComplete = isComplete;
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

//מחיקת משימה
app.MapDelete("/items/{id}", async (ToDoDbContext db, int id) =>
{
    var item = await db.Items.FindAsync(id);
    if (item is null) return Results.NotFound();

    db.Items.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

app.Run();