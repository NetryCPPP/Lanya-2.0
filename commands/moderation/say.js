import discord
from discord.ext import commands

class SayCommand(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(name="say")
    async def say(self, ctx, *, message: str = None):
        """
        Make the bot repeat your message (supports emojis 😎).
        """
        if not message:
            return await ctx.send("⚠️ Please provide a message to say!")

        # Delete the user's command message to keep chat clean
        try:
            await ctx.message.delete()
        except discord.Forbidden:
            pass  # Ignore if bot doesn't have delete permissions

        # Send the same message — emojis & formatting included
        await ctx.send(message)

def setup(bot):
    bot.add_cog(SayCommand(bot))

