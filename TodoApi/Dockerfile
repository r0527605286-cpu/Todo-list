# 1. שלב הבנייה (Build)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# העתקת קובץ הפרויקט קודם כדי לנצל את ה-Cache של Docker
COPY ["TodoApi.csproj", "./"]
RUN dotnet restore "TodoApi.csproj"

# העתקת כל שאר הקבצים ובנייה
COPY . .
RUN dotnet build "TodoApi.csproj" -c Release -o /app/build

# 2. שלב הפרסום (Publish)
FROM build AS publish
RUN dotnet publish "TodoApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 3. שלב ההרצה (Final Image)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# הגדרת הפורט שהאפליקציה תשתמש בו
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

# העתקת הקבצים המוכנים משלב הפרסום
COPY --from=publish /app/publish .

# פקודת ההפעלה
ENTRYPOINT ["dotnet", "TodoApi.dll"]